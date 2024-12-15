// @jest-environment jsdom

describe('MDP Initialization', function() {
  let $input;
  beforeEach(function() {
    document.body.innerHTML = '<input id="datepicker" />';
    $input = $('#datepicker');
  });

  it('should initialize the multi-date picker correctly', function() {
    $input.multiDatesPicker();
    expect($input.hasClass('hasDatepicker')).toBe(true);
  });
});


describe('setMode', function() {
  let $input, date;
  const onSelectSpy = jest.fn();

  beforeEach(function() {
    // Initialize the input field
    document.body.innerHTML = '<input id="datepicker" />';
    $input = $('#datepicker');

    $input.appendTo('body').multiDatesPicker({
      maxPicks: 5,
      onSelect: onSelectSpy,
    });

    date = new Date();

    $input.multiDatesPicker({
        mode: 'normal',
        pickableRange: 7,
        adjustRangeToDisabled: true,
        addDisabledDates: [new Date(date.setDate(10)), new Date(date.setDate(15))]
    });
  });


  it('should set mode to normal and restrict selection to maxPicks', function() {
    $input.multiDatesPicker('addDates', '10/10/2024');
    $input.multiDatesPicker('addDates', '10/11/2024');

    const selectedDates = $input.multiDatesPicker('getDates');
    expect(selectedDates.length).toBe(2);
    expect(selectedDates).toContain('10/10/2024');
    expect(selectedDates).toContain('10/11/2024');
    expect(selectedDates).not.toContain('10/12/2024');
  });


  it('should set pickableRange and adjust minDate and maxDate accordingly', function() {
    const options = { pickableRange: 5 };
    $input.multiDatesPicker('setMode', options);

    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    maxDate.setDate(currentDate.getDate() + options.pickableRange);
    $input.datepicker('option', 'maxDate', maxDate);

    const actualMaxDate = $input.datepicker('option', 'maxDate');
    expect(actualMaxDate).toEqual(maxDate);
  });

  it('should limit the pickable range to 7 days', function() {
    const options = $input.multiDatesPicker();
    const mode = options[0].multiDatesPicker.mode;

    var startDate = new Date();
    var endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    $input.multiDatesPicker('addDates', [startDate, endDate]);
    var selectedDates = $input.multiDatesPicker('getDates');
    var selectedStartDate = new Date(selectedDates[0]);
    var selectedEndDate = new Date(selectedDates[selectedDates.length - 1]);
    var range = (selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24);

    expect(range).toBeLessThanOrEqual(7);
    expect(mode).toBe('normal');
  });

  it('should not allow selection of disabled dates in normal mode', function() {

    $input.multiDatesPicker('addDates', [new Date(date.setDate(10))]);
    const options = $input.multiDatesPicker();
    const mode = options[0].multiDatesPicker.mode;

    var selectedDates = $input.multiDatesPicker('getDates');
    var disabledDates = [new Date(date.setDate(10)), new Date(date.setDate(15))];
    var isDisabledDateSelected = selectedDates.some(function(date) {
        return disabledDates.some(function(disabledDate) {
            return new Date(date).getTime() === disabledDate.getTime();
        });
    });

    expect(isDisabledDateSelected).toBe(false);
    expect(mode).toBe('normal');
  });

});




describe('init', function() {
  let $input;

  beforeEach(function() {
    // Set up the input element before each test
    document.body.innerHTML = '<input id="datepicker">';
    $input = $('#datepicker');
  });

  it('should apply default settings when no options are provided', function() {
    // Call the init function without options
    $input.multiDatesPicker('init');

    // Check that the datepicker was initialized with default settings
    const dateFormat = $input.datepicker('option', 'dateFormat');
    expect(dateFormat).toEqual('mm/dd/yy'); // Default format
  });

  it('should merge custom options with default settings', function() {
    // Call init with custom options
    $input.multiDatesPicker('init', {
      dateFormat: 'dd-mm-yy',
      minDate: new Date('10/01/2024'),
      maxDate: new Date('10/20/2024')
    });

    // Check that the custom dateFormat is applied
    const dateFormat = $input.datepicker('option', 'dateFormat');
    expect(dateFormat).toEqual('dd-mm-yy');

    // Check minDate and maxDate options
    const minDate = $input.datepicker('option', 'minDate');
    const maxDate = $input.datepicker('option', 'maxDate');
    expect(minDate).toEqual(new Date('10/01/2024'));
    expect(maxDate).toEqual(new Date('10/20/2024'));
  });


  it('should call custom onSelect event and toggle date on select', function() {
    const onSelectSpy = jest.fn();

    // Call init with custom onSelect
    $input.multiDatesPicker('init', {
      onSelect: onSelectSpy
    });

    // Simulate selecting a date
    $input.datepicker('setDate', '10/11/2024');
    $input.datepicker('option', 'onSelect').call($input[0], '10/11/2024');

    // Check if custom onSelect is called
    expect(onSelectSpy).toHaveBeenCalled();

    // Check if the date was toggled in the multiDatesPicker instance
    const pickedDates = $input.multiDatesPicker('getDates');
    expect(pickedDates).toContain('10/11/2024');
  });

  it('should correctly set disabled dates and update calendar range', function() {
    const $input = $('<input type="text" id="test-datepicker">').appendTo('body');

    // Initialize with options that set minDate and maxDate
    $input.multiDatesPicker('init', {
        minDate: '01/01/2024',
        maxDate: '12/31/2024',
        addDisabledDates: ['01/15/2024', '01/16/2024']
    });

    const minDate = $input.datepicker('option', 'minDate');
    const maxDate = $input.datepicker('option', 'maxDate');

    expect(minDate).not.toBeNull();
    expect(maxDate).not.toBeNull();

    // Clean up
    $input.remove();
  });


  it('should update altField with selected dates if specified', function() {
    // Set up altField
    document.body.innerHTML += '<input id="altField">';
    const $altField = $('#altField');

    // Call init with altField option
    $input.multiDatesPicker('init', {
      altField: '#altField'
    });

    // Simulate selecting a date
    $input.datepicker('setDate', '10/15/2024');
    $input.datepicker('option', 'onSelect').call($input[0], '10/15/2024');

    // Check that the altField is updated with the selected date
    expect($altField.val()).toEqual('10/15/2024');
  });

});


describe('addDates', function() {
  let $input
  beforeEach(function() {
    document.body.innerHTML = '<input id="datepicker" />';
    $input = $('#datepicker');

  });

  it('should add a date', function() {
    $input.multiDatesPicker();
    try {
      $input.multiDatesPicker('addDates', '05/15/2023');
      const dates = $input.multiDatesPicker('getDates');

      expect(dates.length).toBe(1);
      expect(dates[0]).toBe('05/15/2023');
    } catch (error) {
      console.error('Error in add date test:', error);
      throw error;
    }
  });


  it('should ignore invalid date string', function() {
    expect(function() {
         $input.multiDatesPicker('addDates', 'invalid-date');
     }).toThrowError('Missing number');
   });


   it('should ignore non-date objects', function() {
    expect(function() {
         $input.multiDatesPicker('addDates', { someKey: 'someValue' });
     }).toThrowError('Empty array of dates received.');
   });


   it('should not allow adding a date beyond maxDate', function() {
     // Set maxDate to today
     var today = new Date();
     $input.multiDatesPicker({
         maxDate: today
     });

     // Add a future date beyond the maxDate
     var futureDate = new Date(today);
     futureDate.setDate(today.getDate() + 10);

    expect(function() {
         $input.multiDatesPicker('addDates', futureDate);
     }).toThrowError('Empty array of dates received.');
   });


   it('should handle null input as invalid date', function(){
    expect(function() {
         // Trying to add null as a date
         $input.multiDatesPicker('addDates', null);
     }).toThrowError("Cannot read properties of null (reading 'length')");
   });

})


describe('compareDates', function(){

  let $input;

  beforeEach(function() {
    document.body.innerHTML = '<input id="datepicker" />';
    $input = $('#datepicker');

  });

  it('should return 0 when dates are the same', function() {
      const date1 = new Date('2024-10-10');
      const date2 = new Date('2024-10-10');
      const result = $input.multiDatesPicker('compareDates', date1, date2);

      expect(result).toBe(0);  // They are the same day
  });

  it('should return a positive number when date1 is later than date2', function() {
      const date1 = new Date('2024-10-15');
      const date2 = new Date('2024-10-10');
      const result = $input.multiDatesPicker('compareDates', date1, date2);

      expect(result).toBeGreaterThan(0);  // date1 is later than date2
  });

  it('should return a negative number when date1 is earlier than date2', function() {
      const date1 = new Date('2024-10-05');
      const date2 = new Date('2024-10-10');
      const result = $input.multiDatesPicker('compareDates', date1, date2);

      expect(result).toBeLessThan(0);
  });

  it('should compare dates with different years', function() {
      const date1 = new Date('2025-10-10');
      const date2 = new Date('2024-10-10');
      const result = $input.multiDatesPicker('compareDates', date1, date2);

      expect(result).toBeGreaterThan(0);
  });

  it('should compare dates with different months in the same year', function() {
      const date1 = new Date('2024-11-10');
      const date2 = new Date('2024-10-10');
      const result = $input.multiDatesPicker('compareDates', date1, date2);

      expect(result).toBeGreaterThan(0);
  });

  it('should compare dates with different days in the same month', function() {
      const date1 = new Date('2024-10-12');
      const date2 = new Date('2024-10-10');
      const result = $input.multiDatesPicker('compareDates', date1, date2);

      expect(result).toBeGreaterThan(0);
  });
});


describe('removeDates', function() {
  let $input;

  function formatDate(date) {
      if (date === undefined) return undefined; // Handle undefined input
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [month, day, year].join('/');
  }

  beforeEach(function() {
      // Initialize the input with some dates
      document.body.innerHTML = '<input id="datepicker" />';
      $input = $('#datepicker');

      $input.multiDatesPicker({
          addDates: [
              '10/10/2024',
              '10/12/2024',
              '10/14/2024',
              '10/16/2024'
          ]
      });
  });

  it('should remove a single date', function() {
      const removed = $input.multiDatesPicker('removeDates', '10/12/2024');

      const formattedRemoved = removed.map(formatDate);
      expect(formattedRemoved).toEqual(['10/12/2024']);

      const remainingDates = $input.multiDatesPicker('getDates');
      const formattedRemaining = remainingDates.map(formatDate);
      expect(formattedRemaining).toEqual(['10/10/2024', '10/14/2024', '10/16/2024']);
  });

  it('should remove multiple dates', function() {
      const removed = $input.multiDatesPicker('removeDates', ['10/12/2024', '10/16/2024']);

      const formattedRemoved = removed.map(formatDate);
      expect(formattedRemoved).toEqual(['10/12/2024', '10/16/2024']);

      const remainingDates = $input.multiDatesPicker('getDates');
      const formattedRemaining = remainingDates.map(formatDate);
      expect(formattedRemaining).toEqual(['10/10/2024', '10/14/2024']);
  });

  it('should not remove a date that does not exist', function() {
      const removed = $input.multiDatesPicker('removeDates', '10/18/2024');

      const formattedRemoved = removed.map(formatDate);
      expect(formattedRemoved).toEqual([undefined]);

      const remainingDates = $input.multiDatesPicker('getDates');
      const formattedRemaining = remainingDates.map(formatDate);
      expect(formattedRemaining).toEqual(['10/10/2024', '10/12/2024', '10/14/2024', '10/16/2024']);
  });
});


describe('toggleDate', function() {
  let $input;

  beforeEach(function() {
    document.body.innerHTML = '<input id="datepicker" />';
    $input = $('#datepicker');
    $input.multiDatesPicker({
      addDates: ['10/10/2024', '10/12/2024', '10/14/2024']
    });
  });

  it('should add a date that does not exist', function() {
    $input.multiDatesPicker('toggleDate', '10/16/2024');
    const remainingDates = $input.multiDatesPicker('getDates');
    expect(remainingDates).toContain('10/16/2024');
    expect(remainingDates.length).toBe(4);
  });

  it('should remove a date that exists', function() {
    $input.multiDatesPicker('toggleDate', '10/12/2024');
    const remainingDates = $input.multiDatesPicker('getDates');
    expect(remainingDates).not.toContain('10/12/2024');
    expect(remainingDates.length).toBe(2);
  });

  it('should handle daysRange mode', function() {
    $input.multiDatesPicker('destroy');
    $input.multiDatesPicker({
      mode: 'daysRange',
      autoselectRange: [0, 2]
    });

    $input.multiDatesPicker('toggleDate', '10/10/2024');
    const remainingDates = $input.multiDatesPicker('getDates');
    expect(remainingDates.length).toBe(2);
    expect(remainingDates).toContain('10/10/2024');
    expect(remainingDates).toContain('10/11/2024');
  });

  it('should throw an error when no date is provided', function() {
    expect(function() {
      $input.multiDatesPicker('toggleDate')
    }).toThrow();
  });
});



describe('multiDatesPicker value function', function() {
  let $input;

  beforeEach(function() {
      // Initialize the multiDatesPicker with a separator
      $input = $('<input>').multiDatesPicker({
          separator: ','
      });

      // Add dates to the input
      $input.multiDatesPicker('addDates', ['10/10/2024', '10/12/2024', '10/14/2024']);
  });

  it('should set the value by adding dates from a string', function() {
    const dateString = '10/16/2024,10/18/2024';

    // Clear previous dates before setting new ones
    $input.multiDatesPicker('resetDates', 'picked'); // Clear previously picked dates
    $input.multiDatesPicker('value', dateString); // Set new dates

    const selectedDates = $input.multiDatesPicker('getDates');
    expect(selectedDates).toEqual(['10/16/2024', '10/18/2024']); // Check if new dates are added
  });

  it('should return the current dates as a string', function() {
      const valueString = $input.multiDatesPicker('value'); // Get dates as a string
      expect(valueString).toEqual('10/10/2024,10/12/2024,10/14/2024'); // Should return pre-set dates
  });

  it('should return an empty string when no dates are selected', function() {
      // Initialize without any pre-set dates for this test
      $input = $('<input>').multiDatesPicker({ separator: ',' });
      const valueString = $input.multiDatesPicker('value');
      expect(valueString).toEqual(''); // Expect empty string when no dates are set
  });
});


describe('gotDate', function() {
  let $input;

  beforeEach(function() {
    // Initialize the multiDatesPicker with multiple dates
    document.body.innerHTML = '<input id="datepicker">';
    $input = $('#datepicker');
    // $input.multiDatesPicker('addDates', ['10/10/2024', '10/12/2024', '10/14/2024']);

    // Add picked dates
    $input.multiDatesPicker('addDates', ['10/10/2024', '10/12/2024', '10/14/2024']);

    // Add disabled dates
    $input.multiDatesPicker('addDates', ['10/11/2024', '10/13/2024'], 'disabled');
  });

  it('should return the index of an existing date in the picked dates', function() {
    const index = $input.multiDatesPicker('gotDate', '10/12/2024');
    expect(index).toEqual(1); // Index should be 1 for '10/12/2024'
  });

  it('should return false for a non-existing date', function() {
    const index = $input.multiDatesPicker('gotDate', '10/15/2024');
    expect(index).toEqual(false);
  });

  it('should return the index of an existing date in the disabled dates', function() {
    const index = $input.multiDatesPicker('gotDate', '10/13/2024', 'disabled');
    expect(index).toEqual(1);
  });

  it('should default to checking picked dates when no type is provided', function() {
    const index = $input.multiDatesPicker('gotDate', '10/12/2024');
    expect(index).toEqual(1);
  });
});


describe('removeIndexes', function() {
  let $input;

  beforeEach(function() {
    document.body.innerHTML = '<input id="datepicker">';
    $input = $('#datepicker');
    $input.multiDatesPicker('addDates', ['10/10/2024', '10/12/2024', '10/14/2024']);
  });

  it('should remove a single index from picked dates', function() {
    $input.multiDatesPicker('removeIndexes', 1);
    const pickedDates = $input.multiDatesPicker('getDates');

    expect(pickedDates).toEqual(['10/10/2024', '10/14/2024']);
  });

  it('should remove multiple indexes from picked dates', function() {

    $input.multiDatesPicker('removeIndexes', [0, 2]);
    const pickedDates = $input.multiDatesPicker('getDates');

    expect(pickedDates).toEqual(['10/12/2024']);
  });
});


describe('resetDates', function() {
  let $input;

  beforeEach(function() {
    document.body.innerHTML = '<input id="datepicker">';
    $input = $('#datepicker');
    $input.multiDatesPicker('addDates', ['10/10/2024', '10/12/2024', '10/14/2024']);
  });

  it('should reset picked dates', function() {
    let pickedDates = $input.multiDatesPicker('getDates');

    expect(pickedDates).toEqual(['10/10/2024', '10/12/2024', '10/14/2024']);

    $input.multiDatesPicker('resetDates', 'picked');

    pickedDates = $input.multiDatesPicker('getDates');
    expect(pickedDates).toEqual([]);
  });


  it('should reset picked dates by default if no type is provided', function() {
    let pickedDates = $input.multiDatesPicker('getDates');
    expect(pickedDates).toEqual(['10/10/2024', '10/12/2024', '10/14/2024']);

    $input.multiDatesPicker('resetDates');

    pickedDates = $input.multiDatesPicker('getDates');
    expect(pickedDates).toEqual([]);
  });
});


describe('getDates', function() {
  let $input;

  beforeEach(function() {
    document.body.innerHTML = '<input id="datepicker">';
    $input = $('#datepicker');

    // Add picked dates
    $input.multiDatesPicker('addDates', ['10/10/2024', '10/12/2024', '10/14/2024']);

    // Add disabled dates
    $input.multiDatesPicker('addDates', ['10/11/2024', '10/13/2024'], 'disabled');

  });

  it('should return picked dates as a string array by default', function() {
    const pickedDates = $input.multiDatesPicker('getDates');
    expect(pickedDates).toEqual(['10/10/2024', '10/12/2024', '10/14/2024']);
  });

  it('should return disabled dates as a string array', function() {
    const disabledDates = $input.multiDatesPicker('getDates', 'string', 'disabled');
    expect(disabledDates).toEqual(['10/11/2024', '10/13/2024']);
  });

  it('should return picked dates as objects when format is "object"', function() {
    const pickedDates = $input.multiDatesPicker('getDates', 'object');
    expect(pickedDates).toEqual([
      new Date('10/10/2024'),
      new Date('10/12/2024'),
      new Date('10/14/2024')
    ]);
  });

  it('should return disabled dates as objects when format is "object"', function() {
    const disabledDates = $input.multiDatesPicker('getDates', 'object', 'disabled');
    expect(disabledDates).toEqual([
      new Date('10/11/2024'),
      new Date('10/13/2024')
    ]);
  });

  it('should return picked dates as numbers when format is "number"', function() {
    const pickedDates = $input.multiDatesPicker('getDates', 'number');
    expect(pickedDates).toEqual([
      Date.parse('10/10/2024'),
      Date.parse('10/12/2024'),
      Date.parse('10/14/2024')
    ]);
  });

  it('should return disabled dates as numbers when format is "number"', function() {
    const disabledDates = $input.multiDatesPicker('getDates', 'number', 'disabled');
    expect(disabledDates).toEqual([
      Date.parse('10/11/2024'),
      Date.parse('10/13/2024')
    ]);
  });

  it('should throw an error for unsupported formats', function() {
    expect(function() {
      $input.multiDatesPicker('getDates', 'unsupportedFormat');
    }).toThrowError('Format "unsupportedFormat" not supported!');
  });
});

describe('sumDays', function() {

  let $input;

  beforeEach(function() {
    document.body.innerHTML = '<input id="datepicker">';
    $input = $('#datepicker');
  });

  it('should add positive days to a Date object', function() {
      const initialDate = new Date(2024, 9, 1);
      const n_days = 5;

      const result = $input.multiDatesPicker('sumDays', initialDate, n_days);
      const expectedDate = new Date(2024, 9, 6);

      expect(result).toEqual(expectedDate);
  });

  it('should subtract days when n_days is negative', function() {
      const initialDate = new Date(2024, 9, 10);
      const n_days = -3;

      const result = $input.multiDatesPicker('sumDays', initialDate, n_days);
      const expectedDate = new Date(2024, 9, 7);

      expect(result).toEqual(expectedDate);
  });

  it('should handle adding days to a date in string format', function() {
    const initialDate = '10/01/2024';
    const n_days = 10;
    const result = $input.multiDatesPicker('sumDays', initialDate, n_days);
    expect(result).toBe('10/11/2024');
  });

  it('should handle leap years correctly', function() {
      const initialDate = new Date(2024, 1, 28);
      const n_days = 2;

      const result = $input.multiDatesPicker('sumDays', initialDate, n_days);
      const expectedDate = new Date(2024, 2, 1);

      expect(result).toEqual(expectedDate);
  });

  it('should handle month overflow correctly', function() {
      const initialDate = new Date(2024, 9, 31);
      const n_days = 5;

      // Call sumDays and check result
      const result = $input.multiDatesPicker('sumDays', initialDate, n_days);
      const expectedDate = new Date(2024, 10, 5);

      expect(result).toEqual(expectedDate);
  });
});


describe('destroy', function() {
  let $input;

  beforeEach(function() {
    document.body.innerHTML = '<input id="datepicker">';
    $input = $('#datepicker');
    $input.multiDatesPicker();
  });

  it('should set multiDatesPicker instance to null and destroy the datepicker', function() {
    expect($input[0].multiDatesPicker).toBeDefined();

    $input.multiDatesPicker('destroy');

    expect($input[0].multiDatesPicker).toBeNull();
    expect($input.datepicker('getDate')).toBeNull();
  });
});


