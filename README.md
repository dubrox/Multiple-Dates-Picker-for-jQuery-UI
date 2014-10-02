# ABOUT
Find more infos on the [official MDP page](http://multidatespickr.sf.net).
__CAUTION__: 1.6.x has changes to methods and options that are incompatible with previous versions of the same methods.

# WHAT'S NEW
## v1.6.4
* Fix in maintaining custom dateFormat in toggleDate method.
* Fixed respecting beforeShowDay custom classes.
* Minor fixes.

## v1.6.3
* Added "destroy" method.
* Added method "value" that returns the string value that would be used in input elements.
* Refreshing calendar if dates are modified using MDP methods.
* Fixed the link within altField, input field and their initial html value attribute.
* Minor changes.

## v1.6.2
* Bug fixes

## v1.6.1
* Any preloaded values in input text field or altField are added to the calendar automatically.
* Now 'beforeShowDay' is as transparent as it can be.

## v1.6.0
__CAUTION__: 1.6.x has changes to methods and options that are incompatible with previous versions of the same methods.
* Simplified 'mode' options syntax.
* Changed the way 'removeDates' works, now it receives dates instead of indexes.
* Added 'removeIndexes' method, that is a fixed version of the previous 'removeDates' method.
* Added numeric format (milliseconds) as date format available.
* Fixed 'pickableRange' option.
* Improved conversion method.

## v1.5.3
*	Fixed method 'removeDates' does not work when passing an array of indexes.
*	Added an error when method 'addDates' receives an empty array.

## v1.5.2
*	Fills the input field with pre selected dates on load.
*	Deleted an exceeded comma that caused problems in IE7 and earlier.

## v1.5.1
*	[Fixes the `altField` filled with `defaultDate` by default.](https://sourceforge.net/tracker/?func=detail&atid=1495382&aid=3404699&group_id=358205)

## v1.5.0
__CAUTION__: 1.5.x has changes to methods and options that are incompatible with previous versions of the same methods.
*	changed AVOIDED term with DISABLED so, for example, `addAvoidedDates` now is `addDisabledDates`.
*	[added `altField` capability.](https://sourceforge.net/tracker/?func=detail&aid=3401147&group_id=358205&atid=1495382)
*	[fixed `jQuery.noConflict()`.](https://sourceforge.net/tracker/?func=detail&aid=3392035&group_id=358205&atid=1495382)
*	[fixed two days selection instead of only one.](https://sourceforge.net/tracker/?func=detail&aid=3390576&group_id=358205&atid=1495382)

## v1.4.0
*	[Added support for datepicker from input fields.](https://sourceforge.net/tracker/?func=detail&aid=3083801&group_id=358205&atid=1495385)

## v1.3.5
*	Changed the default minimum date from `Date()` to `Date(0)`.
*	Fixed some bugs when trying to compare a date with an unknown object: now the unknown object is considered as `Date(0)`.
*	Some code reorganization.

## v1.3.0
*	General bugs fixes.

## v1.2.0
*	First public version.
