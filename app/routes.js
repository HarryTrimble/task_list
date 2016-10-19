var express = require('express');
var router = express.Router();

// Notify API

var NotifyClient = require('notifications-node-client').NotifyClient,

notifyClient = new NotifyClient(
  "https://api.notifications.service.gov.uk",
  process.env.NOTIFY_SERVICE_ID,
  process.env.NOTIFY_KEY // API Key
);

// Send email to user
router.post('/save_and_return/email', function (req, res) {

  // get the answer from the query string (eg. ?over18="yes")
  var email = req.body.email;
  var templateId = 'f9474a23-d3e5-4c14-8b05-d6b19a34b542'
  var personalisation = {'name':'Tom Riddle', 'ref number':'1280880'}

  console.info(email); 
  notifyClient.sendEmail(templateId, email, personalisation);

    // if users does NOT have right to work in the UK
    res.redirect("/save_and_return/saved");

});

router.use(function (req, res, next) {

 // Store common vars

 res.locals.formData = "";
 res.locals.formQuery = "?";
 res.locals.data = {};

 for (var name in req.query){
   var value = req.query[name];
   res.locals.formData += '<input type="hidden" name="'+name+'" value="' + value + '">\n';
   res.locals.formQuery += name + "=" + value + "&";
   res.locals.data[name] = value;
 }

 next();
 
});

router.get('/', function (req, res) {
  res.render('index');

});


// Branching

// Questions for childminders

// Question for questions/country/index.html

router.get('/questions/eligibility/age', function (req, res) {

  console.log("country");

  // get the answer from the query string (eg. ?over18="yes")
  var country = req.query.country;

  if (country == "northern_ireland" ){

    // if user lives in NORTHERN IRELAND
    res.redirect("/questions/result" + res.locals.formQuery);

  } else if (country == "scotland" ){

    // if user lives in SCOTLAND
    res.redirect("/questions/result" + res.locals.formQuery);

  } else if (country == "wales" ){

    // if user lives in WALES
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if users lives in ENGLAND
    res.render('questions/eligibility/age/index.html');

  }

});

// Question for questions/eligibility/index.html
router.get('/questions/eligibility/right_to_work_in_uk', function (req, res) {

  console.log("over18");

  // get the answer from the query string (eg. ?over18="yes")
  var over18 = req.query.over18;

  if (over18 == "no" ){

    // if users is NOT 18 or over
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if users IS 18 or over
    res.render('questions/eligibility/right_to_work_in_uk/index.html');

  }

});

// Question for questions/eligibility/right_to_work_in_uk/index.html
router.get('/questions/eligibility/criminal_history', function (req, res) {

  console.log("right_to_work");

  // get the answer from the query string (eg. ?over18="yes")
  var right_to_work = req.query.right_to_work;

  if (right_to_work == "no" ){

    // if users does NOT have right to work in the UK
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if users is DOES have right to work in the UK
    res.render('questions/eligibility/criminal_history/index.html');

  }

});


// Question for questions/eligibility/criminal_history/index.html
router.get('/questions/will_you_be_paid', function (req, res) {

  console.log("criminal_history");

  // get the answer from the query string (eg. ?over18="yes")
  var criminal_history = req.query.criminal_history;

  if (criminal_history == "yes" ){

    // if user DOES have a criminal history
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if user does NOT have criminal history
    res.render('questions/will_you_be_paid/index.html');

  }

});

// Question for questions/will_you_be_paid/index.html
router.get('/questions/care_time_per_day', function (req, res) {

  console.log("will_you_be_paid");

  // get the answer from the query string (eg. ?over18="yes")
  var will_you_be_paid = req.query.will_you_be_paid;

  if (will_you_be_paid == "no" ){

    // if user will NOT be paid
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if user WILL be paid
    res.render('questions/care_time_per_day/index.html');

  }

});

// Question for questions/care_time_per_day/index.html
router.get('/questions/related_to_child', function (req, res) {

  console.log("care_time_per_day");

  // get the answer from the query string (eg. ?over18="yes")
  var care_time_per_day = req.query.care_time_per_day;

  if (care_time_per_day == "less_than_two_hours" ){

    // if user will work LESS than two hours
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if user will work MORE than two hours
    res.render('questions/related_to_child/index.html');

  }

});

// Question for questions/related_to_child/index.html
router.get('/questions/child_age', function (req, res) {

  console.log("related_to_child");

  // get the answer from the query string (eg. ?over18="yes")
  var related_to_child = req.query.related_to_child;

  if (related_to_child == "yes" ){

    // if user IS related to child
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('questions/child_age/index.html');

  }

});

// Question for questions/child_age/index.html
router.get('/questions/number_of_children', function (req, res) {

  console.log("child_age");

  // get the answer from the query string (eg. ?over18="yes")
  var child_age = req.query.child_age;

  if (child_age == "8_and_over" ){

    // if user IS related to child
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('questions/number_of_children/index.html');

  }

});

// Questions for childminders

// Question for questions/country/index.html

router.get('/driving/questions/eyes', function (req, res) {

  console.log("over17");
  console.log("over16");

  // get the answer from the query string (eg. ?over18="yes")
  var over16 = req.query.over16;
  var over17 = req.query.over17;

  if (over16 == "no" ){

    // if user is NOT 17 or over
    res.redirect("/driving/questions/result" + res.locals.formQuery);

  } else if (over17 == "no" ){

    // if user lives in WALES
    res.redirect("/driving/questions/result" + res.locals.formQuery);


  } else {

    // if users IS 18 or over
    res.render('driving/questions/eyes/index.html');

  }

});

// Question for driving/questions/eyes/index.html
router.get('/driving/questions/insurance', function (req, res) {

  console.log("read_from_20_meters");

  // get the answer from the query string (eg. ?over18="yes")
  var read_from_20_meters = req.query.read_from_20_meters;
  var needs_glasses_or_contacts = req.query.needs_glasses_or_contacts;

  if (read_from_20_meters == "yes" && needs_glasses_or_contacts==undefined ){

    // if user IS related to child
    res.redirect("/driving/questions/eyes/glasses_contact_lenses" + res.locals.formQuery);

  } else if (read_from_20_meters == "no" ){

    // if user lives in WALES
    res.redirect("/driving/questions/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('driving/questions/insurance/index.html');

  }

});

// BATS

// question in /bats/task_list/inspect_place_where_bats_live/visit_bat_place
router.get('/bats/task_list/check_before_you_start/ecologist/past_applications', function (req, res) {

  console.log("hired_ecologist");

  // get the answer from the query string (eg. ?over18="yes")
  var hired_ecologist = req.query.hired_ecologist;

  if (hired_ecologist == "no"){

    // if user IS related to child
    res.redirect("/bats/task_list/check_before_you_start/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/check_before_you_start/ecologist/past_applications/index.html');

  }

});

// Question for /bats/task_list/check_before_you_start/ecologist
router.get('/bats/task_list', function (req, res) {

  console.log("hired_ecologist");
  console.log("impact_on_bats");

  // get the answer from the query string (eg. ?over18="yes")
  var impact_on_bats = req.query.impact_on_bats;
  var own_occupy = req.query.own_occupy;
  var has_owners_permission = req.query.has_owners_permission;
  var needs_others_licences = req.query.needs_others_licences;
  var licence_types = req.query.licence_types;

  if (own_occupy == "no" && has_owners_permission==undefined ){

    // if user IS related to child
    res.redirect("/bats/task_list/check_before_you_start/land_ownership/has_owners_permission" + res.locals.formQuery);

  } else if (own_occupy == "no" && has_owners_permission== "no" ){

    // if user lives in WALES
    res.redirect("/bats/task_list/check_before_you_start/result" + res.locals.formQuery);

  } else if (impact_on_bats == "yes" ){

    // if user lives in WALES
    res.redirect("/bats/task_list/inspect_place_where_bats_live/result" + res.locals.formQuery);

  } else if (needs_others_licences == "yes" && licence_types==undefined ){

      // if user lives in WALES
      res.redirect("/bats/task_list/building_datails/permissions/types" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/index.html');

  }

});


// question in /bats/task_list/inspect_place_where_bats_live/visit_bat_place
router.get('/bats/task_list/inspect_place_where_bats_live/alternative', function (req, res) {

  console.log("visit_bat_place");

  // get the answer from the query string (eg. ?over18="yes")
  var visit_bat_place = req.query.visit_bat_place;

  if (visit_bat_place == "no"){

    // if user IS related to child
    res.redirect("/bats/task_list/inspect_place_where_bats_live/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/inspect_place_where_bats_live/alternative/index.html');

  }

});

// question in /bats/task_list/inspect_place_where_bats_live/alternative
router.get('/bats/task_list/inspect_place_where_bats_live/impact_on_bats', function (req, res) {

  console.log("alternative");

  // get the answer from the query string (eg. ?over18="yes")
  var alternative = req.query.alternative;

  if (alternative == "yes"){

    // if user IS related to child
    res.redirect("/bats/task_list/inspect_place_where_bats_live/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/inspect_place_where_bats_live/impact_on_bats/index.html');

  }

});

// question in /bats/task_list/inspect_place_where_bats_live/alternative
router.get('/bats/task_list/building_datails/category', function (req, res) {

  console.log("repairs_maintenance");
  console.log("roof_loft_extension");
  console.log("building_conservation");
  console.log("much_need_housing");

  // get the answer from the query string (eg. ?over18="yes")
  var repairs_maintenance = req.query.repairs_maintenance;
  var roof_loft_extension = req.query.roof_loft_extension;
  var building_conservation = req.query.building_conservation;
  var much_need_housing = req.query.much_need_housing;
  var give_reason = req.query.give_reason;

  if (repairs_maintenance == "no" && roof_loft_extension == "no" && building_conservation == "no" && much_need_housing == "no" && give_reason==undefined){

    // if user IS related to child
    res.redirect("/bats/task_list/building_datails/reason/give" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/building_datails/category/index.html');

  }

});

// question in /bats/task_list/get_references/referee_1/relationship
router.get('/bats/task_list/get_references/referee_1/address', function (req, res) {

  console.log("known_ref_one");

  // get the answer from the query string (eg. ?over18="yes")
  var known_ref_one = req.query.known_ref_one;

  if (known_ref_one == "no"){

    // if user IS related to child
    res.redirect("/bats/task_list/get_references/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/get_references/referee_1/address/index.html');

  }

});

// question in /bats/task_list/get_references/referee_2/relationship
router.get('/bats/task_list/get_references/referee_2/address', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var known_ref_two = req.query.known_ref_two;

  if (known_ref_two == "no"){

    // if user IS related to child
    res.redirect("/bats/task_list/get_references/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/get_references/referee_2/address/index.html');

  }

});

// check your answers for 'Check before you start' section
router.get('/bats/task_list/check_before_you_start/ecologist', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var hired_ecologist = req.query.hired_ecologist;
  var past_applications = req.query.past_applications;
  var own_occupy = req.query.own_occupy;

  if (hired_ecologist && past_applications && own_occupy ){

    // if user IS related to child
    res.redirect("/bats/task_list/check_before_you_start/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/check_before_you_start/ecologist/index.html');

  }

});

// check your answers for 'Inspect where the bats are' section
router.get('/bats/task_list/inspect_place_where_bats_live/visit_bat_place', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var visit_bat_place = req.query.visit_bat_place;
  var alternative = req.query.alternative;
  var impact_on_bats = req.query.impact_on_bats;

  if (visit_bat_place && alternative && impact_on_bats ){

    // if user IS related to child
    res.redirect("/bats/task_list/inspect_place_where_bats_live/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/inspect_place_where_bats_live/visit_bat_place/index.html');

  }

});

// check your answers for 'Describe the bats' section
router.get('/bats/task_list/bat_details/species', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var bat_species = req.query.bat_species;
  var number_bats = req.query.number_bats;
  var number_breeding_sites = req.query.number_breeding_sites;
  var number_resting_sites = req.query.number_resting_sites;
  var activity = req.query.activity;
  var method = req.query.method;
  var method_statement = req.query.method_statement;

  if (bat_species && number_bats && number_breeding_sites && number_resting_sites && activity && method && method_statement ){

    // if user IS related to child
    res.redirect("/bats/task_list/bat_details/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/bat_details/species/index.html');

  }

});

// check your answers for 'Describe your building project' section
router.get('/bats/task_list/building_datails/address', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var category = req.query.category;
  var needs_others_licences = req.query.needs_others_licences;

  if (category && needs_others_licences ){

    // if user IS related to child
    res.redirect("/bats/task_list/building_datails/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/building_datails/address/index.html');

  }

});

// check your answers for 'Describe your building project' section
router.get('/bats/task_list/contact_details', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var applicant_name = req.query.applicant_name;
  var user_type = req.query.user_type;
  var ecologist_name = req.query.ecologist_name;
  var who_should_be_contacted = req.query.who_should_be_contacted;

  if (applicant_name && user_type && ecologist_name && who_should_be_contacted ){

    // if user IS related to child
    res.redirect("/bats/task_list/contact_details/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/contact_details/index.html');

  }

});

// check your answers for 'Describe your building project' section
router.get('/bats/task_list/get_references/experience', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var ecologist_education = req.query.ecologist_education;
  var ecologist_licence = req.query.ecologist_licence;

  if (ecologist_education && ecologist_licence ){

    // if user IS related to child
    res.redirect("/bats/task_list/get_references/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('bats/task_list/get_references/experience/index.html');

  }

});

module.exports = router;
