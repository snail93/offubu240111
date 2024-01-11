const goo = require('mongoose');

const timeOfDayBoundsSchema = new goo.Schema({
    Early_AM_Begin:[Number],Early_AM_End:[Number],
    Morning_Begin:[Number],Morning_End:[Number],
    Afternoon_Begin:[Number],Afternoon_End:[Number],
    Evening_Begin:[Number],Evening_End:[Number]
});
const calViewSchema = new goo.Schema({
    title: String,
    context: String,
    sch_draft_button_text: String,
    day_col: String,
    times_of_day: [String],
    times_of_day_bounds: timeOfDayBoundsSchema,
    modal_placeholder: String
});

const modeSchema = new goo.Schema({ 
    name: String, mode: Mixed
});
const modeListSchema = new goo.Schema({
    title: String, mode_list: [modeSchema]
});

const foodSchema = new goo.Schema({ 
    name: String, measure: Number, unit: String
});
const nutrientBalanceListSchema = new goo.Schema({
    title: String, food_list: [foodSchema]
});

const labelSchema = new goo.Schema({
    name: String, label_text: String
});
const commentSchema = new goo.Schema({
    author: String,
    labels: [labelSchema],
    timestamp: Date,
    comment_text: String
});
const commentListSchema = new goo.Schema({
    title: String,
    button_text: String,
    comments_list: [commentSchema]
});

const ruleSchema = new goo.Schema({
    rule_meaning: String,
    ont_reasoned_rule_text: String
});
const ruleListSchema = new goo.Schema({
    title: String,
    clicked_holding: String,
    rules_list: [ruleSchema]
});

const calSchema = new goo.Schema({
    ordinal_number: Number,
    calmon_title: String,
    pending: Boolean,
    day_names: [String],
    card_titles: [String],
    margin_subheadings: [String],
    scheduled_cal_view: calViewSchema,
    adhered_cal_view: calViewSchema,
    modes: modeListSchema,
    nutrient_balance: nutrientBalanceListSchema,
    comments: commentListSchema,
    rules_header: ruleListSchema,
});