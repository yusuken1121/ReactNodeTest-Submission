const MeetingHistory = require('../../model/schema/meeting');
const mongoose = require('mongoose');

const formattedMeeting = (meeting) => {
  const meetingObj = meeting.toObject();

  meetingObj.createdByName = meeting.createBy
    ? `${meeting.createBy.firstName || ''} ${meeting.createBy.lastName || ''}`.trim()
    : '';

  meetingObj.attendesNames =
    meeting.attendes
      ?.map((attendee) =>
        `${attendee.firstName || ''} ${attendee.lastName || ''}`.trim()
      )
      .join(', ') || '';

  meetingObj.attendesLeadNames =
    meeting.attendesLead?.map((lead) => lead.leadName || '').join(', ') || '';

  meetingObj.attendeesDisplay =
    meetingObj.related === 'Contact'
      ? meetingObj.attendesNames
      : meetingObj.related === 'Lead'
        ? meetingObj.attendesLeadNames
        : '';

  return meetingObj;
};

const add = async (req, res) => {
  try {
    const {
      agenda,
      attendes,
      attendesLead,
      location,
      dateTime,
      notes,
      related,
      createBy,
    } = req.body;

    // Ensure createBy is provided, as it's required by the schema
    if (!createBy) {
      return res.status(400).json({ error: 'Created by user ID is required.' });
    }

    const newMeeting = new MeetingHistory({
      agenda,
      attendes,
      attendesLead,
      location,
      dateTime,
      notes,
      createBy,
      related,
      timestamp: new Date(), // Set current timestamp
    });

    await newMeeting.save();

    res.status(201).json(newMeeting);
  } catch (err) {
    console.error('Failed to create Meeting:', err);
    res
      .status(400)
      .json({ error: 'Failed to create Meeting', details: err.message });
  }
};

const index = async (req, res) => {
  try {
    const query = { deleted: false };

    const meetings = await MeetingHistory.find(query)
      .populate({
        path: 'createBy',
        select: 'firstName lastName email',
        match: { deleted: false },
      })
      .populate({
        path: 'attendes',
        select: 'fullName email',
        match: { deleted: false },
      })
      .populate({
        path: 'attendesLead',
        select: 'leadName leadEmail',
        match: { deleted: false },
      })
      .exec();

    const filteredMeetings = meetings.filter(
      (meeting) =>
        meeting.createBy !== null &&
        (meeting.attendes.every((attendee) => attendee !== null) ||
          meeting.attendes.length === 0) &&
        (meeting.attendesLead.every((attendee) => attendee !== null) ||
          meeting.attendesLead.length === 0)
    );

    const formattedMeetings = filteredMeetings.map(formattedMeeting);

    res.status(200).json(formattedMeetings);
  } catch (err) {
    console.error('Failed to retrieve Meetings:', err);
    res
      .status(500)
      .json({ error: 'Failed to retrieve Meetings', details: err.message });
  }
};

const view = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Meeting ID.' });
    }

    const meeting = await MeetingHistory.findOne({ _id: id, deleted: false })
      .populate({
        path: 'createBy',
        select: 'firstName lastName email',
        match: { deleted: false },
      })
      .populate({
        path: 'attendes',
        select: 'fullName email',
        match: { deleted: false },
      })
      .populate({
        path: 'attendesLead',
        select: 'leadName leadEmail',
        match: { deleted: false },
      })
      .exec();

    if (!meeting) {
      return res
        .status(404)
        .json({ message: 'Meeting not found or has been deleted.' });
    }
    const formattedMeetingData = formattedMeeting(meeting);

    res.status(200).json(formattedMeetingData);
  } catch (err) {
    console.error('Failed to retrieve Meeting:', err);
    res
      .status(500)
      .json({ error: 'Failed to retrieve Meeting', details: err.message });
  }
};

// Add for achieving CRUD operations
const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Meeting ID.' });
    }

    if (updateData.deleted !== undefined) {
      delete updateData.deleted;
    }

    const updatedMeeting = await MeetingHistory.findByIdAndUpdate(
      { _id: id, deleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedMeeting) {
      return res
        .status(404)
        .json({ message: 'Meeting not found or has been deleted.' });
    }

    res.status(200).json(updatedMeeting);
  } catch (err) {
    console.error('Failed to update Meeting:', err);
    res
      .status(400)
      .json({ error: 'Failed to update Meeting', details: err.message });
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Meeting ID.' });
    }

    const meeting = await MeetingHistory.findByIdAndUpdate(
      { _id: id, deleted: false },
      { $set: { deleted: true } },
      { new: true }
    );

    if (!meeting) {
      return res
        .status(404)
        .json({ message: 'Meeting not found or already deleted.' });
    }

    res.status(200).json({ message: 'Meeting deleted successfully.', meeting });
  } catch (err) {
    console.error('Failed to delete Meeting:', err);
    res
      .status(500)
      .json({ error: 'Failed to delete Meeting', details: err.message });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: 'An array of Meeting IDs is required.' });
    }

    // Validate all IDs are valid ObjectIds
    const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        error: 'One or more invalid Meeting IDs provided.',
        invalidIds,
      });
    }

    const result = await MeetingHistory.updateMany(
      { _id: { $in: ids }, deleted: false },
      { $set: { deleted: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'No meetings found to delete with the provided IDs.',
      });
    }

    res.status(200).json({
      message: `${result.modifiedCount} meetings deleted successfully.`,
      result,
    });
  } catch (err) {
    console.error('Failed to delete multiple Meetings:', err);
    res.status(500).json({
      error: 'Failed to delete multiple Meetings',
      details: err.message,
    });
  }
};

module.exports = {
  add,
  index,
  view,
  edit,
  deleteData,
  deleteMany,
};
