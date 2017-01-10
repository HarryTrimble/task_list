function ShowHideContent() {
  var self = this;

  self.escapeElementName = function(str) {
    result = str.replace('[', '\\[').replace(']', '\\]')
    return(result);
  };

  self.showHideRadioToggledContent = function () {
    $(".block-label input[type='radio']").each(function () {

      var $radio = $(this);
      var $radioGroupName = $radio.attr('name');
      var $radioLabel = $radio.parent('label');

      var dataTarget = $radioLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (dataTarget) {

        // Set aria-controls
        $radio.attr('aria-controls', dataTarget);

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $radio.closest('form').find(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {
            var $this = $(this);

            var groupDataTarget = $this.parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.addClass('js-hidden');
            // Set aria-expanded and aria-hidden for hidden content
            $this.attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

          var $dataTarget = $('#' + dataTarget);
          $dataTarget.removeClass('js-hidden');
          // Set aria-expanded and aria-hidden for clicked radio
          $radio.attr('aria-expanded', 'true');
          $dataTarget.attr('aria-hidden', 'false');

        });

      } else {
        // If the data-target attribute is undefined for a radio button,
        // hide visible data-target content for radio buttons in the same group

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {

            var groupDataTarget = $(this).parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.addClass('js-hidden');
            // Set aria-expanded and aria-hidden for hidden content
            $(this).attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

        });
      }

    });
  }
  self.showHideCheckboxToggledContent = function () {

    $(".block-label input[type='checkbox']").each(function() {

      var $checkbox = $(this);
      var $checkboxLabel = $(this).parent();

      var $dataTarget = $checkboxLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

        // Set aria-controls
        $checkbox.attr('aria-controls', $dataTarget);

        // Set aria-expanded and aria-hidden
        $checkbox.attr('aria-expanded', 'false');
        $('#'+$dataTarget).attr('aria-hidden', 'true');

        // For checkboxes revealing hidden content
        $checkbox.on('click', function() {

          var state = $(this).attr('aria-expanded') === 'false' ? true : false;

          // Toggle hidden content
          $('#'+$dataTarget).toggleClass('js-hidden');

          // Update aria-expanded and aria-hidden attributes
          $(this).attr('aria-expanded', state);
          $('#'+$dataTarget).attr('aria-hidden', !state);

        });
      }

    });
  }
}

$(document).ready(function() {

  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
  new GOVUK.SelectionButtons($blockLabels);

  // Show and hide toggled content
  // Where .block-label uses the data-target attribute
  var toggleContent = new ShowHideContent();
  toggleContent.showHideRadioToggledContent();
  toggleContent.showHideCheckboxToggledContent();


  //orders task list numbers 
  var $groupNumbers = $( ".group-number" );

  $groupNumbers.each(function(index) {

    $( this ).append(index+1+".");

  });

  //orders task list numbers 
  var $stepNumbers = $( ".step-number" );

  $stepNumbers.each(function(index) {

    $( this ).append(index+1+".");

  });

  $('#total-steps').text($stepNumbers.length);
  $('#total-steps').text($stepNumbers.length);


  var $completedTasks = $( ".task-status-banner" );
  
  $('#completed-steps').text($completedTasks.length);

});

// Add another item in /transport_goods/task_list/describe_vehicles/reg_number_weight

    $(document).on('click', '.button-add-another', function (e) {
      var beforeThis = $(this).closest('.grid-row');
      e.preventDefault();
      insertFields(beforeThis);
      sortFields();
    });

    $(document).on('click', '.remove-list-item', function (e) {
      e.preventDefault();
      $(this).parents('.list-item-wrapper').remove();
      sortFields();
    });

    function insertFields(element) {
      element.before(
        '<div class="grid-row">' +
          '<div class="form-group-compound list-item-wrapper">' +
            '<h2 class="heading-medium">Vehicle 1</h2>' +
            '<fieldset>' +
              '<div class="column-one-third no-padding">' +
                '<div class="form-group list-item">' +
                  '<label class="form-label" for="reg_number_x">' +
                    'Registration number' +
                  '</label>' +
                  '<input type="text" class="form-control" id="reg_number_x" name="reg_number_x">' +
                '</div>' +
              '</div>' +
              '<div class="column-one-third no-padding">' +
                '<div class="form-group list-item">' +
                  '<label class="form-label" for="weight_x">' +
                    'Weight when loaded' +
                  '</label>' +
                  '<input type="text" class="form-control" id="weight_x" name="weight_x">' +
                '</div>' +
              '</div>' +
              '<div class="column-one-third no-padding">' +
                '<div class="list-item">' +
                '</div>' +
              '</div>' +
            '</fieldset>' +
          '</div>' +
        '</div>'
      );
    }

    function sortFields() {
      var listCounter = 1;

      $(document).find('.list-item-wrapper').each(function () {
        console.log(this)
        $(this).find('h2').text('Vehicle ' + listCounter);

        if ($(this).find('.remove-list-item').length === 0) {
          $(this).find('.list-item:last').append('<a id="remove-item-' + listCounter + '" class="remove-list-item" href="#">Remove this</a>');
        } else {
          $(this).find('.remove-list-item').attr('id', 'remove-item-' + listCounter);
        }

        $(this).find('label[for^=reg_number_]').attr('for', 'reg_number_' + listCounter);
        $(this).find('input[id^=reg_number_]').attr('id', 'reg_number_' + listCounter).attr('name', 'reg_number_' + listCounter);
        $(this).find('label[for^=weight_]').attr('for', 'weight_' + listCounter);
        $(this).find('input[id^=weight_]').attr('id', 'weight_' + listCounter).attr('name', 'weight_' + listCounter);

        listCounter++;
      });

      if ($(document).find('.list-item-wrapper').length === 1) {
        $('.remove-list-item').remove();
      }
    }

// prove money calculator


