express = require('express');
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

 // Store common vars in string

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

  // get the answer from the query string (eg. ?country="Scotland")
  var country = req.query.country;

  if (country == "Northern Ireland" ){

    // if user lives in NORTHERN IRELAND
    res.redirect("/questions/result" + res.locals.formQuery);

  } else if (country == "Scotland" ){

    // if user lives in SCOTLAND
    res.redirect("/questions/result" + res.locals.formQuery);

  } else if (country == "Wales" ){

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

    // if users is does NOT have rights to work in UK
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if users is DOES have right to work in the UK
    res.render('questions/eligibility/criminal_history/index.html');

  }

});


// Question for questions/eligibility/criminal_history/index.html
router.get('/questions/will_you_be_paid', function (req, res) {

  console.log("criminal_history");

  // get the answer from the query string (eg. ?criminal_history="yes")
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

  // get the answer from the query string (eg. ?will_you_be_paid="no")
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

  // get the answer from the query string (eg. ?care_time_per_day="yes")
  var care_time_per_day = req.query.care_time_per_day;

  if (care_time_per_day == "less than two hours" ){

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

  if (related_to_child == "no" ){

    // if user IS related to child
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('questions/child_age/index.html');

  }

});

// Question for questions/child_age/index.html
router.get('/questions/place_type', function (req, res) {

  console.log("child_age");

  // get the answer from the query string (eg. ?over18="yes")
  var child_age = req.query.child_age;
  var voluntarily_register = req.query.voluntarily_register;

  if (child_age == "8 and older" && voluntarily_register==undefined ){

    // if user is will care for ONLY children aged 8 AND OVER
    res.redirect("/questions/result" + res.locals.formQuery);

  } else {

    res.render('questions/place_type/index.html');

  }

});


// Question for questions/eligibility/criminal_history/index.html
router.get('/questions/food', function (req, res) {

  console.log("criminal_history");

  // get the answer from the query string (eg. ?shared_home="yes")
  var shared_home = req.query.shared_home;
  var others_have_dbs = req.query.others_have_dbs;
  var how_many_others = req.query.how_many_others;

  if (shared_home == "yes" && others_have_dbs==undefined ){

    // if OTHERS have access to place of care
    res.redirect("/questions/shared_place/others_have_dbs" + res.locals.formQuery);

  } else if (shared_home == "yes" && others_have_dbs== "no" && how_many_others==undefined ){

    // if others DON'T have dbs checks 
    res.redirect("/questions/shared_place/how_many_others" + res.locals.formQuery);

  } else if (shared_home == "yes" && others_have_dbs== "not sure" && how_many_others==undefined ){

    // if others MIGHT NOT have dbs checks 
    res.redirect("/questions/shared_place/how_many_others" + res.locals.formQuery);

  } else {

    // if NO others have access to place of care
    res.render('questions/food/index.html');

  }

});

// Calculate total cost to pay
router.get('/questions/result/cost', function (req, res) {

  console.log("calculate application costs");

  // get the answer from the query string (eg. ?over18="yes")
  var calculate_cost = req.query.calculate_cost;

  if (calculate_cost){

    // Not sure how to get rid of this
    res.redirect("/transport_goods/task_list/prove_money/check_your_answers" + res.locals.formQuery);

  } else {

    var cost_of_other_criminal_checks = (req.query.how_many_others) * 44

    cost_of_other_criminal_checks = cost_of_other_criminal_checks.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    var how_many_others = (req.query.how_many_others);

    if (req.query.how_many_others) { 

        var total_cost_1 = 44 + (req.query.how_many_others) * 44 + 35 
        var total_cost_2 = 44 + (req.query.how_many_others) * 44 + 35 
        var total_cost_3 = 44 + (req.query.how_many_others) * 44 + 103 


    } else { var total_cost_1 = 44 + 35
             var total_cost_2 = 44 + 35
             var total_cost_3 = 44 + 103 }

    // if user is NOT related to child
    res.render('questions/result/cost/index.html', {cost_of_other_criminal_checks : cost_of_other_criminal_checks, total_cost_1 : total_cost_1, total_cost_2 : total_cost_2, total_cost_3 : total_cost_3});

  }

});

// calculate cost for others dbs checks if 
router.get('/task_list/check_others_criminal_history', function (req, res) {

  console.log("state cost for check_others_criminal_history");

  // get the answer from the query string (eg. ?over18="yes")
  var uploaded_document = req.query.uploaded_document;

  if (uploaded_document){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/prove_money/check_your_answers" + res.locals.formQuery);

  } else {

    var cost_of_other_criminal_checks = (req.query.how_many_others) * 44

    cost_of_other_criminal_checks = cost_of_other_criminal_checks.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // if user is NOT related to child
    res.render('task_list/check_others_criminal_history/index.html', {cost_of_other_criminal_checks : cost_of_other_criminal_checks});

  }

});

// Check your answers for 'Check eligibility, cost and time'
router.get('/questions/reason', function (req, res) {

  console.log("check your answers");

  // get the answer from the query string (eg. ?over18="yes")
  var check_eligibility_cost_time = req.query.check_eligibility_cost_time;

  if (check_eligibility_cost_time == "done" ){


    // if user IS related to child
    res.redirect("/questions/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('questions/reason/index.html');

  }

});

// Add cost for OTHERS criminal checks
router.get('/task_list/check_others_criminal_history', function (req, res) {

  console.log("check your answers");

  // get the answer from the query string (eg. ?over18="yes")
  var check_before_you_start = req.query.check_before_you_start;

  if (check_before_you_start == "rock this party" ){


    // if user IS related to child
    res.redirect("/questions/check_your_answers" + res.locals.formQuery);

  } else {

  var cost_of_other_criminal_checks = (req.query.how_many_others) * 44

    // if user is NOT related to child
    res.render('task_list/check_others_criminal_history/index.html', {cost_of_other_criminal_checks : cost_of_other_criminal_checks});

  }

});

// Questions for 'Learn to drive'

// Question for questions/country/index.html

router.get('/driving/questions/eyes', function (req, res) {

  console.log("over17");
  console.log("over16");

  // get the answer from the query string (eg. ?over18="yes")
  var over16 = req.query.over16;
  var over17 = req.query.over17;

  if (over16 == "no" ){

    // if user is NOT 16 or older
    res.redirect("/driving/questions/result" + res.locals.formQuery);

  } else if (over17 == "no" ){

    // if user is NOT 17 or older
    res.redirect("/driving/questions/result" + res.locals.formQuery);


  } else {

    // if users IS 17 or older
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

    // if user CAN read number plate from 20 meets
    res.redirect("/driving/questions/eyes/glasses_contact_lenses" + res.locals.formQuery);

  } else if (read_from_20_meters == "no" ){

    // if user CANNOT read number plate from 20 meets
    res.redirect("/driving/questions/result" + res.locals.formQuery);

  } else {

    // if user CAN read number plate from 20 meets
    res.render('driving/questions/insurance/index.html');

  }

});

// Check your ansers for 'Check eligibility, cost and time'
router.get('/driving/questions/reason', function (req, res) {

  console.log("check your answers");

  // get the answer from the query string (eg. ?over18="yes")
  var driving_lessons = req.query.driving_lessons;

  if ( driving_lessons ){

    // if user HAS checked eligibility, cost and time
    res.redirect("/driving/questions/check_your_answers" + res.locals.formQuery);

  } else {

    // if user HASN'T yet checked eligibility, cost and time
    res.render('driving/questions/reason/index.html');

  }

});

// BATS

// question in /bats/task_list/inspect_place_where_bats_live/visit_bat_place
router.get('/bats/task_list/check_before_you_start/ecologist/past_applications', function (req, res) {

  console.log("hired_ecologist");

  // get the answer from the query string (eg. ?over18="yes")
  var hired_ecologist = req.query.hired_ecologist;

  if (hired_ecologist == "no"){

    // if user HAS hired ecologist
    res.redirect("/bats/task_list/check_before_you_start/result" + res.locals.formQuery);

  } else {

    // if user has NOT hired ecologist
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

    // if user does NOT own land
    res.redirect("/bats/task_list/check_before_you_start/land_ownership/has_owners_permission" + res.locals.formQuery);

  } else if (own_occupy == "no" && has_owners_permission== "no" ){

    // if user does NOT own land and does NOT have permission from owner
    res.redirect("/bats/task_list/check_before_you_start/result" + res.locals.formQuery);

  } else if (impact_on_bats == "yes" ){

    // if there WILL be impact on bats
    res.redirect("/bats/task_list/inspect_place_where_bats_live/result" + res.locals.formQuery);

  } else if (needs_others_licences == "yes" && licence_types==undefined ){

    // if user DOES need other licences. For example planning permission
    res.redirect("/bats/task_list/building_datails/permissions/types" + res.locals.formQuery);

  } else {

    // return user to task list
    res.render('bats/task_list/index.html');

  }

});


// question in /bats/task_list/inspect_place_where_bats_live/visit_bat_place
router.get('/bats/task_list/inspect_place_where_bats_live/alternative', function (req, res) {

  console.log("visit_bat_place");

  // get the answer from the query string (eg. ?over18="yes")
  var visit_bat_place = req.query.visit_bat_place;

  if (visit_bat_place == "no"){

    // if ecologist has NOT visited place where bats are
    res.redirect("/bats/task_list/inspect_place_where_bats_live/result" + res.locals.formQuery);

  } else {

    // if ecologist HAS visited place where bats are
    res.render('bats/task_list/inspect_place_where_bats_live/alternative/index.html');

  }

});

// question in /bats/task_list/inspect_place_where_bats_live/alternative
router.get('/bats/task_list/inspect_place_where_bats_live/impact_on_bats', function (req, res) {

  console.log("alternative");

  // get the answer from the query string (eg. ?over18="yes")
  var alternative = req.query.alternative;

  if (alternative == "yes"){

    // if there IS alternative to moving bats
    res.redirect("/bats/task_list/inspect_place_where_bats_live/result" + res.locals.formQuery);

  } else {

    // if there is NOT alternative to moving bats
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

    // if user has does NOT have common reason for doing the work
    res.redirect("/bats/task_list/building_datails/reason/give" + res.locals.formQuery);

  } else {

    // else
    res.render('bats/task_list/building_datails/category/index.html');

  }

});

// question in /bats/task_list/get_references/referee_1/relationship
router.get('/bats/task_list/get_references/referee_1/address', function (req, res) {

  console.log("known_ref_one");

  // get the answer from the query string (eg. ?over18="yes")
  var known_ref_one = req.query.known_ref_one;

  if (known_ref_one == "no"){

    // if ecologist has NOT known referee one more than 3 years
    res.redirect("/bats/task_list/get_references/result" + res.locals.formQuery);

  } else {

    // if ecologist HAS known referee one more than 3 years
    res.render('bats/task_list/get_references/referee_1/address/index.html');

  }

});

// question in /bats/task_list/get_references/referee_2/relationship
router.get('/bats/task_list/get_references/referee_2/address', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var known_ref_two = req.query.known_ref_two;

  if (known_ref_two == "no"){

    // if ecologist has NOT known referee two more than 3 years
    res.redirect("/bats/task_list/get_references/result" + res.locals.formQuery);

  } else {

    // if ecologist HAS known referee two more than 3 years
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

    // if user HAS done this section
    res.redirect("/bats/task_list/check_before_you_start/check_your_answers" + res.locals.formQuery);

  } else {

    // if user has NOT yet done this section
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

    // if user HAS done this section
    res.redirect("/bats/task_list/inspect_place_where_bats_live/check_your_answers" + res.locals.formQuery);

  } else {

    // if user has NOT yet done this section
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

    // if user HAS done this section
    res.redirect("/bats/task_list/bat_details/check_your_answers" + res.locals.formQuery);

  } else {

    // if user has NOT yet done this section
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

    // if user HAS done this section
    res.redirect("/bats/task_list/building_datails/check_your_answers" + res.locals.formQuery);

  } else {

    // if user has NOT yet done this section
    res.render('bats/task_list/building_datails/address/index.html');

  }

});

// check your answers for 'Contact details' section
router.get('/bats/task_list/contact_details', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var applicant_name = req.query.applicant_name;
  var user_type = req.query.user_type;
  var ecologist_name = req.query.ecologist_name;
  var who_should_be_contacted = req.query.who_should_be_contacted;

  if (applicant_name && user_type && ecologist_name && who_should_be_contacted ){

    // if user HAS done this section
    res.redirect("/bats/task_list/contact_details/check_your_answers" + res.locals.formQuery);

  } else {

    // if user has NOT yet done this section
    res.render('bats/task_list/contact_details/index.html');

  }

});

// check your answers for 'Get refences' section
router.get('/bats/task_list/get_references/experience', function (req, res) {

  console.log("known_ref_two");

  // get the answer from the query string (eg. ?over18="yes")
  var ecologist_education = req.query.ecologist_education;
  var ecologist_licence = req.query.ecologist_licence;

  if (ecologist_education && ecologist_licence ){

    // if user HAS done this section
    res.redirect("/bats/task_list/get_references/check_your_answers" + res.locals.formQuery);

  } else {

    // if user has NOT yet done this section
    res.render('bats/task_list/get_references/experience/index.html');

  }

});

// TRANSPORT GOODS

// question in /transport_goods/task_list/check_before_you_start/weight/empty
router.get('/transport_goods/task_list/check_before_you_start/how_many_vehicles', function (req, res) {

  console.log("weight");

  // get the answer from the query string (eg. ?over18="yes")
  var weight_empty = req.query.weight_empty;
  var weight_loaded = req.query.weight_loaded;

  if (weight_empty == "less than 1,525 kg" && weight_loaded==undefined ){

    // if vehicles are TOO LIGHT when empty for licence
    res.redirect("/transport_goods/task_list/check_before_you_start/weight/loaded" + res.locals.formQuery);

  } else if (weight_empty == "less than 1,525 kg" && weight_loaded== "less than 3,5000 kg" ){

    // if vehicles are TOO LIGHT when empty and loaded for licence
    res.redirect("/transport_goods/task_list/check_before_you_start/result" + res.locals.formQuery);

  } else {

    // if vehicles are HEAVY ENOUGH when empty or loaded for licence
    res.render('transport_goods/task_list/check_before_you_start/how_many_vehicles/index.html');

  }

});

// question in /transport_goods/task_list/check_before_you_start/exempt_vehicles
router.get('/transport_goods/task_list/check_before_you_start/carrying_passengers', function (req, res) {

  console.log("exempt_vehicles");

  // get the answer from the query string (eg. ?over18="yes")
  var exempt_vehicles = req.query.exempt_vehicles;

  if (exempt_vehicles == "yes" ){

    // if user WILL be operating vehicles exempt from this licence. For example a snowplough
    res.redirect("/transport_goods/task_list/check_before_you_start/result/" + res.locals.formQuery);

  } else {

    // if user will NOT be operating vehicles exempt from this licence
    res.render('transport_goods/task_list/check_before_you_start/carrying_passengers/index.html');

  }

});

// question in /transport_goods/task_list/check_before_you_start/carrying_passengers
router.get('/transport_goods/task_list/check_before_you_start/trade_plates', function (req, res) {

  console.log("carrying_passengers");

  // get the answer from the query string (eg. ?over18="yes")
  var carrying_passengers = req.query.carrying_passengers;

  if (carrying_passengers == "yes" ){

    // if vehicles WILL be carrying passengers
    res.redirect("/transport_goods/task_list/check_before_you_start/result" + res.locals.formQuery);

  } else {

    // if vehicles will NOT be carrying passengers
    res.render('transport_goods/task_list/check_before_you_start/trade_plates/index.html');

  }

});

// question in /transport_goods/task_list/check_before_you_start/trade_plates
router.get('/transport_goods/task_list/check_before_you_start/short_distance/less_than_6_miles_a_week', function (req, res) {

  console.log("trade_plates");

  // get the answer from the query string (eg. ?over18="yes")
  var trade_plates = req.query.trade_plates;

  if (trade_plates == "yes" ){

    // if vehicle WILL have trade plates
    res.redirect("/transport_goods/task_list/check_before_you_start/result" + res.locals.formQuery);

  } else {

    // if vehicle will NOT have trade plates
    res.render('transport_goods/task_list/check_before_you_start/short_distance/less_than_6_miles_a_week/index.html');

  }

});

// questions (3) in /transport_goods/task_list/check_before_you_start/short_distance
router.get('/transport_goods/task_list/check_before_you_start/licence_type/just_your_goods', function (req, res) {

  console.log("short_distance");

  // get the answer from the query string (eg. ?over18="yes")
  var six_miles_a_week = req.query.six_miles_a_week;
  var digging_demolition = req.query.digging_demolition;
  var same_owner = req.query.same_owner;

  if (six_miles_a_week == "yes" && digging_demolition==undefined && same_owner==undefined ){

    // if vehicles ARE only for digging
    res.redirect("/transport_goods/task_list/check_before_you_start/short_distance/digging_demolition" + res.locals.formQuery);

  } else if (six_miles_a_week == "yes" && digging_demolition == "yes" && same_owner==undefined ){

    // Then user does NOT need licence
    res.redirect("/transport_goods/task_list/check_before_you_start/result" + res.locals.formQuery);

  } else if (six_miles_a_week == "yes" && digging_demolition == "no" && same_owner==undefined ){

    // if vehicles will driven LESS than 6 miles a week
    res.redirect("/transport_goods/task_list/check_before_you_start/short_distance/same_owner" + res.locals.formQuery);

  } else if (six_miles_a_week == "yes" && digging_demolition == "no" && same_owner == "yes" ){

    // Then user does NOT need licence
    res.redirect("/transport_goods/task_list/check_before_you_start/result" + res.locals.formQuery);

  } else {

    // Then user DOES need licence
    res.render('transport_goods/task_list/check_before_you_start/licence_type/just_your_goods/index.html');

  }

});

// qustions (2) for /transport_goods/task_list/check_before_you_start/licence
router.get('/transport_goods/task_list/check_before_you_start/transport_manager', function (req, res) {

  console.log("just_your_goods");

  // get the answer from the query string (eg. ?over18="yes")
  var just_your_goods = req.query.just_your_goods;
  var outside_uk = req.query.outside_uk;

  if (just_your_goods == "no" && outside_uk ==undefined ){

    // user needs INTERNATIONAL licence
    res.redirect("/transport_goods/task_list/check_before_you_start/licence_type/outside_uk" + res.locals.formQuery);

  } else {

    // user needs STANDARD licence
    res.render('transport_goods/task_list/check_before_you_start/transport_manager/index.html');

  }

});

// calculate licence cost in /transport_goods/task_list/check_before_you_start/result/cost
router.get('/transport_goods/task_list/check_before_you_start/result/cost', function (req, res) {

  console.log("application_cost");

  // get the answer from the query string (eg. ?over18="yes")
  var transport_manager = req.query.transport_manager;

  if (transport_manager == "have to have it"){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/check_before_you_start/check_your_answers" + res.locals.formQuery);

  } else {

    var application_cost = 257 + 6650 + (req.query.how_many_vehicles - 1) * 3700

    application_cost = application_cost.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    var maintenance_costs = 6650 + (req.query.how_many_vehicles - 1) * 3700

    maintenance_costs = maintenance_costs.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // if user is NOT related to child
    res.render('transport_goods/task_list/check_before_you_start/result/cost/index.html', {application_cost : application_cost, maintenance_costs : maintenance_costs});

  }

});

// check your answers for 'Check eligibility, cost and time' section
router.get('/transport_goods/task_list/check_before_you_start/weight/empty', function (req, res) {

  console.log("check_your_answers");

  // get the answer from the query string (eg. ?transport_manager="yes")
  var transport_manager = req.query.transport_manager;

  if (transport_manager){

    // if user HAS done this section
    res.redirect("/transport_goods/task_list/check_before_you_start/check_your_answers" + res.locals.formQuery);

  } else {

    // if user has NOT yet done this section
    res.render('transport_goods/task_list/check_before_you_start/weight/empty/index.html');

  }

});

// check your answers for 'Read rules' section
router.get('/transport_goods/task_list/read_rules', function (req, res) {

  console.log("check_your_answers");

  // get the answer from the query string (eg. ?over18="yes")
  var read_rules = req.query.read_rules;

  if (read_rules == "yes" ){

  // if user HAS done this section
  res.redirect("/transport_goods/task_list/read_rules/check_your_answers" + res.locals.formQuery);

  } else {

    // if user has NOT yet done this section
    res.render('transport_goods/task_list/read_rules/index.html');

  }

});

// check your answers for 'Become a transport manager' section
router.get('/transport_goods/task_list/transport_manager/check_your_answers', function (req, res) {

  console.log("check_your_answers");

  // get the answer from the query string (eg. ?over18="yes")
  var now_transport_manager = req.query.now_transport_manager;

  if (now_transport_manager == "no" ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/transport_manager/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/transport_manager/check_your_answers/index.html');

  }

});

// check your answers for 'Read rules' section
router.get('/transport_goods/task_list/transport_manager', function (req, res) {

  console.log("check_your_answers");

  // get the answer from the query string (eg. ?over18="yes")
  var now_transport_manager = req.query.now_transport_manager;

  if (now_transport_manager == "yes" ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/transport_manager/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/transport_manager/index.html');

  }

});

// users who haven't given public notice yet
router.get('/transport_goods/task_list/give_public_notice/check_your_answers', function (req, res) {

  console.log("given_public_notice");

  // get the answer from the query string (eg. ?over18="yes")
  var given_public_notice = req.query.given_public_notice;

  if (given_public_notice == "no" ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/give_public_notice/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/give_public_notice/check_your_answers/index.html');

  }

});

// link to 'Become transport manager' from 'Read rules'
// check your answers for 'Give public notice' section
router.get('/transport_goods/task_list/give_public_notice/reason', function (req, res) {

  console.log("given_public_notice");

  // get the answer from the query string (eg. ?over18="yes")
  var transport_manager = req.query.transport_manager;
  var now_transport_manager = req.query.now_transport_manager;
  var given_public_notice = req.query.given_public_notice;

  if (transport_manager == "no" && now_transport_manager==undefined ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/transport_manager" + res.locals.formQuery);

  } else if (transport_manager == "no" && now_transport_manager == "yes" && given_public_notice == "yes" ){

    // if user lives in WALES
    res.redirect("/transport_goods/task_list/give_public_notice/check_your_answers" + res.locals.formQuery);

  } else if (given_public_notice == "yes" ){

    // if user lives in WALES
    res.redirect("/transport_goods/task_list/give_public_notice/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/give_public_notice/reason/index.html');

  }

});

// questions for /transport_goods/task_list/describe_vehicles/has_vehicles_already
router.get('/transport_goods/task_list/describe_vehicles/reg_number_weight', function (req, res) {

  console.log("has_vehicles_already");

  // get the answer from the query string (eg. ?over18="yes")
  var has_vehicles_already = req.query.has_vehicles_already;

  if (has_vehicles_already == "no" ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/describe_vehicles/has_vehicles_when" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/describe_vehicles/reg_number_weight/index.html');

  }

});

// check your answers for 'Describe your vehicles' section
router.get('/transport_goods/task_list/describe_vehicles/has_vehicles_already', function (req, res) {

  console.log("check_your_answers_vehicles");

  // get the answer from the query string (eg. ?over18="yes")
  var has_vehicles_already = req.query.has_vehicles_already;

  if (has_vehicles_already){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/describe_vehicles/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/describe_vehicles/has_vehicles_already/index.html');

  }

});

// questions for /transport_goods/task_list/describe_vehicles/has_vehicles_already
router.get('/transport_goods/task_list/maintain_vehicles/name_address', function (req, res) {

  console.log("has_mechanic");

  // get the answer from the query string (eg. ?over18="yes")
  var has_mechanic = req.query.has_mechanic;

  if (has_mechanic == "no" ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/maintain_vehicles/result" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/maintain_vehicles/name_address/index.html');

  }

});

// check your answers for 'Maintain vehicles' section
router.get('/transport_goods/task_list/maintain_vehicles/reason', function (req, res) {

  console.log("check_your_answers_maintain_vehicles");

  // get the answer from the query string (eg. ?over18="yes")
  var has_mechanic = req.query.has_mechanic;

  if (has_mechanic){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/maintain_vehicles/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/maintain_vehicles/reason/index.html');

  }

});

// check your answers for 'Maintain vehicles' section
router.get('/transport_goods/task_list/prove_money/reason', function (req, res) {

  console.log("uploaded_document");

  // get the answer from the query string (eg. ?over18="yes")
  var uploaded_document = req.query.uploaded_document;

  if (uploaded_document){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/prove_money/check_your_answers" + res.locals.formQuery);

  } else {

    var maintenance_costs = 6650 + (req.query.how_many_vehicles - 1) * 3700

    maintenance_costs = maintenance_costs.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // if user is NOT related to child
    res.render('transport_goods/task_list/prove_money/reason/index.html', {maintenance_costs : maintenance_costs});

  }

});


// check your answers for 'Your contact details' section
router.get('/transport_goods/task_list/contact_details', function (req, res) {

  console.log("contact_by");

  // get the answer from the query string (eg. ?over18="yes")
  var contact_by = req.query.contact_by;

  if (contact_by){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/contact_details/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/contact_details/index.html');

  }

});

// questions for /transport_goods/task_list/convictions_penalties/convictions
router.get('/transport_goods/task_list/convictions_penalties/compensation_order', function (req, res) {

  console.log("convictions");

  // get the answer from the query string (eg. ?over18="yes")
  var crime = req.query.crime;
  var about_crime = req.query.about_crime;

  if (crime == "yes" && about_crime==undefined ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/convictions_penalties/crime/about_crime" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/convictions_penalties/compensation_order/index.html');

  }

});

// questions for /transport_goods/task_list/convictions_penalties/convictions
router.get('/transport_goods/task_list/convictions_penalties/reason', function (req, res) {

  console.log("compensation_order");

  // get the answer from the query string (eg. ?over18="yes")
  var compensation_order = req.query.compensation_order;

  if (compensation_order ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list/convictions_penalties/check_your_answers" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/task_list/convictions_penalties/reason/index.html');

  }

});

// Save and return

// Become a childminder

// questions for /transport_goods/save_and_return/want_to
router.get('/save_and_return/email', function (req, res) {

  console.log("save and return");

  // get the answer from the query string (eg. ?over18="yes")
  var wants_save_and_return = req.query.wants_save_and_return;

  if (wants_save_and_return == "no" ){

    // if user IS related to child
    res.redirect("/task_list/" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('save_and_return/email/index.html');

  }

});

// Learn to drive

// questions for /transport_goods/save_and_return/want_to
router.get('/driving/save_and_return/email', function (req, res) {

  console.log("save and return");

  // get the answer from the query string (eg. ?over18="yes")
  var wants_save_and_return = req.query.wants_save_and_return;

  if (wants_save_and_return == "no" ){

    // if user IS related to child
    res.redirect("/driving/task_list/" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('driving/save_and_return/email/index.html');

  }

});

// Transport goods

// questions for /transport_goods/save_and_return/want_to
router.get('/transport_goods/save_and_return/already_started/check_your_email', function (req, res) {

  console.log("returning to application");

  // get the answer from the query string (eg. ?over18="yes")
  var already_started = req.query.already_started;

  if (already_started == "no" ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/save_and_return/already_started/check_your_email/index.html');

  }

});

// questions for /transport_goods/save_and_return/want_to
router.get('/transport_goods/save_and_return/email', function (req, res) {

  console.log("save and return");

  // get the answer from the query string (eg. ?over18="yes")
  var wants_save_and_return = req.query.wants_save_and_return;

  if (wants_save_and_return == "no" ){

    // if user IS related to child
    res.redirect("/transport_goods/task_list" + res.locals.formQuery);

  } else {

    // if user is NOT related to child
    res.render('transport_goods/save_and_return/email/index.html');

  }

});

module.exports = router;
