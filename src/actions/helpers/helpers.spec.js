const assert = require('assert');
const {
  eventExists,
  eventAlreadyExists,
  mapUsernameToUserInfo,
  mapToFrequency,
  mapToTime,
  mapPeriodtoDate,
  timezoneExists
} = require('./helpers');
const moment = require('moment');

describe('helpers', function() {
  describe('mapUsernameToUserInfo', function() {
    it('should correctly map user names to ids', function() {
      const usernameToUserInfo = new Map([
        ['@dtoki', { user_id: 'U_ID_0', user_im_id: 'U_IM_ID_0' }],
        ['@alireza.eva.u23', { user_id: 'U_ID_1', user_im_id: 'U_IM_ID_1' }],
        ['@grace', { user_id: 'U_ID_2', user_im_id: 'U_IM_ID_2' }]
      ]);
      const myUserInfo = { user_id: 'U_ID_2', user_im_id: 'U_IM_ID_2' };
      usernames = ['@dtoki', 'me'];
      const expected = [
        { user_id: 'U_ID_0', user_im_id: 'U_IM_ID_0' },
        { user_id: 'U_ID_2', user_im_id: 'U_IM_ID_2' }
      ];
      const mapping = mapUsernameToUserInfo(
        usernames,
        usernameToUserInfo,
        myUserInfo
      );
      assert.deepEqual(expected, mapping);
    });

    it('should throw an error given a username that does not exist', function() {
      const usernameToUserInfo = new Map([
        ['@alireza.eva.u23', { user_id: 'U_ID_1', user_im_id: 'U_IM_ID_1' }],
        ['@grace', { user_id: 'U_ID_2', user_im_id: 'U_IM_ID_2' }]
      ]);
      const myUserInfo = { user_id: 'U_ID_2', user_im_id: 'U_IM_ID_2' };
      usernames = ['@dtoki', 'me'];
      assert.throws(
        () => mapUsernameToUserInfo(usernames, usernameToUserInfo, myUserInfo),
        /the user @dtoki does not exist/
      );
    });
  });

  describe('mapToTime', function() {
    it('should correctly validate and transform a time in a string into an object -format: hh:mm am <timezone>', function() {
      const timeString = '12:30 am America/New_York';
      const expected = {
        hh: '0',
        mm: '30',
        zone: 'America/New_York'
      };
      const time = mapToTime(timeString);
      assert.deepEqual(expected, time);
    });

    it('should correctly validate and transform a time in a string into an object -format: hh:mm pm <timezone>', function() {
      const timeString = '12:30 pm America/New_York';
      const expected = {
        hh: '12',
        mm: '30',
        zone: 'America/New_York'
      };
      const time = mapToTime(timeString);
      assert.deepEqual(expected, time);
    });

    it('should correctly validate and transform a time in a string into an object -format: h:mm am <timezone>', function() {
      const timeString = '1:30 am America/New_York';
      const expected = {
        hh: '1',
        mm: '30',
        zone: 'America/New_York'
      };
      const time = mapToTime(timeString);
      assert.deepEqual(expected, time);
    });

    it('should correctly validate and transform a time in a string into an object -format: 0h:mm am <timezone>', function() {
      const timeString = '01:30 am America/New_York';
      const expected = {
        hh: '1',
        mm: '30',
        zone: 'America/New_York'
      };
      const time = mapToTime(timeString);
      assert.deepEqual(expected, time);
    });

    it('should throw an error given incorrect time format -format hh:mmam <timezone>', function() {
      const timeString = '12:30am  America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format hh:mmpm <timezone>', function() {
      const timeString = '12:30pm  America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format hh pm <timezone>', function() {
      const timeString = '12 pm  America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format hh am <timezone>', function() {
      const timeString = '11 am  America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format hh:mm <timezone>', function() {
      const timeString = '12:30 America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format h <timezone>', function() {
      const timeString = '6 America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format hh:mmmm am <timezone>', function() {
      const timeString = '6:2020 am America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format hh:mmm am <timezone>', function() {
      const timeString = '6:000 am America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format hh:m am <timezone>', function() {
      const timeString = '6:2 am America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format :mmm am <timezone>', function() {
      const timeString = ':120 am  America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given incorrect time format -format hhhh am <timezone>', function() {
      const timeString = '6000 am America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given correct format but illegal times -format hh:mm am <timezone> where hh > 12', function() {
      const timeString = '13:00 am everyday America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given correct format but illegal times -format hh:mm pm <timezone> where hh > 12', function() {
      const timeString = '13:00 pm everyday America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given correct format but illegal times -format hh:mm pm <timezone> where mm > 59', function() {
      const timeString = '1:60 pm everyday America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });

    it('should throw an error given no time', function() {
      const timeString = 'everyday America/New_York';
      assert.throws(
        () => mapToTime(timeString),
        /incorrectly formatted time/
      );
    });
  });

  describe('mapToFrequency', function() {
    it('should correctly validate and transform the frequency given a string', function() {
      const period = '12:30 am every day';
      const expected = 'EVERYDAY';
      const frequency = mapToFrequency(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly validate and transform the frequency given a string', function() {
      const period = '12:30 am everyday';
      const expected = 'EVERYDAY';
      const frequency = mapToFrequency(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly validate and transform the frequency given a string', function() {
      const period = '12:30 am EVERYDAY';
      const expected = 'EVERYDAY';
      const frequency = mapToFrequency(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly validate and transform the frequency given a string', function() {
      const period = '12:30 am every work day';
      const expected = 'WEEKDAYS';
      const frequency = mapToFrequency(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly validate and transform the frequency given a string', function() {
      const period = '12:30 am on workdays';
      const expected = 'WEEKDAYS';
      const frequency = mapToFrequency(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly validate and transform the frequency given a string', function() {
      const period = '12:30 am on weekdays';
      const expected = 'WEEKDAYS';
      const frequency = mapToFrequency(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly validate and transform the frequency given a string', function() {
      const period = '12:20 on weekends';
      const expected = 'WEEKENDS';
      const frequency = mapToFrequency(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly validate and transform the frequency given a string', function() {
      const period = '12:20 on saturdays';
      const expected = 'SATURDAYS';
      const frequency = mapToFrequency(period);
      assert.deepEqual(expected, frequency);
    });

    it('should throw an error given an incorrect frequency', function() {
      const period = 'once every blue moon at 4am';
      assert.throws(
        () => mapToFrequency(period),
        /incorrect frequency/
      );
    });

    it('should throw an error given an incorrect frequency', function() {
      const period = 'never - I dont want to work';
      assert.throws(
        () => mapToFrequency(period),
        /incorrect frequency/
      );
    });
  });

  describe('eventExists', function() {
    it('should correctly check if an event exists and not throw an error', function() {
      const events = new Set(['artris', 'lazy-jar']);
      eventExists('artris', events);
    });

    it('should throw an error given an event that does not exist', function() {
      const events = new Set(['lazy-jar']);
      assert.throws(
        () => eventExists('artris', events),
        /the project specified does not exist/
      );
    });
  });

  describe('eventAlreadyExists', function() {
    it('should correctly check if an event already exists given an event that does not exist', function() {
      const events = new Set(['lazy-jar']);
      eventAlreadyExists('artris', events);
    });

    it('should throw an error given an event that already exists', function() {
      const events = new Set(['artris', 'lazy-jar']);
      assert.throws(
        () => eventAlreadyExists('artris', events),
        /the project artris already exists/
      );
    });
  });

  describe('mapPeriodToDate', function() {
    it('should correctly map a period to a date giving a number of days', function() {
      const period = '3 days';
      const expected = moment()
        .add(3, 'days')
        .format('DD-MM-YYYY');
      const frequency = mapPeriodtoDate(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly map a period to a date giving a number of weeks', function() {
      const period = '10 weeks';
      const expected = moment()
        .add(10, 'weeks')
        .format('DD-MM-YYYY');
      const frequency = mapPeriodtoDate(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly map a period to a date giving a number of months', function() {
      const period = '3 months';
      const expected = moment()
        .add(3, 'months')
        .format('DD-MM-YYYY');
      const frequency = mapPeriodtoDate(period);
      assert.deepEqual(expected, frequency);
    });

    it('should correctly map a period to a date giving a number of years', function() {
      const period = '3 years';
      const expected = moment()
        .add(3, 'years')
        .format('DD-MM-YYYY');
      const frequency = mapPeriodtoDate(period);
      assert.deepEqual(expected, frequency);
    });

    it('should throw an error with an incorrectly formatted string', function() {
      assert.throws(
        () => mapPeriodtoDate('2 days and two weeks'),
        /incorrect period/
      );
    });

    it('should throw an error with an incorrectly formatted string', function() {
      assert.throws(
        () => mapPeriodtoDate('3 weekdays'),
        /incorrect period/
      );
    });
  });

  describe('timezoneExists', function() {
    it('should not throw an error given a correct timezone', function() {
      assert.doesNotThrow(() => timezoneExists('America/New_York'))
    });
    it('should throw an error if an incorrect timezone is given', function() {
      assert.throws(
        () => timezoneExists('incorrect tz'),
        /incorrect timezone/);
    });
    it('should throw an error if an undefined timezone is given', function() {
      assert.throws(
        () => timezoneExists(undefined),
        /no timezone specified/);
    });
  });
});
