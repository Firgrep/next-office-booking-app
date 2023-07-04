

* Build functionality with rooms linked to user

* make dashboard UI

* block all user interaction on billing page until update refetch completes.CHECK THIS

* build booking full for the day indicator on calendar

* change enums to const enums in subscriptionTiers.ts

* build invoice failed for subscriptions. Revert user's subscription to flexplay upon invoice failed. 

## BUGS
* app does not display bookings for today, even though they are there in db. It is Monday 30/07/2023 and it's not showing for Monday. 

* fix calendar BUG with phone booths, wrong display (logic error or frontend??)

* when changing rooms on the calendar, the previous room is not de-selected