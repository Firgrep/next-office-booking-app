* update react-calendar to latest and test

* fine-grain calendar day selection to remove those that have already passed for today

* block all user interaction on billing page until update refetch completes. Double check this

* build booking full for the day indicator on calendar

* build invoice failed for subscriptions. Revert user's subscription to flexplay upon invoice failed. 

* build login page

* When a subscription invoice fails, there is currently no interaction on the server to deal with this. The idea was to first build out the email system before implementing this route on the webhook, which itself first required a domain to be set up. 

* SEO and metadata lacking.

* Service contact for registered users.


## BUGS
* app does not display bookings for today, even though they are there in db. It is Monday 30/07/2023 and it's not showing for Monday. 
