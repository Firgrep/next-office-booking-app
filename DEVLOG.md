In my date comparsion callback function in the Calendar React component, I was trying to compare two date datatypes directly.

```js
const hasBooking = bookings?.some(booking => 
    booking.startTime === date
);
```

But this didn't work. Looking into the matter further I discovered that the reason was that JavaScript wasn't doing this comparison based on values but whether they had the same reference. Since, in this case, `booking.startTime` and `date` are both Date objects, and comparing them directly with `===` checks if they refer to the exact same object _in memory_, rather than comparing their _values_.

So I re-wrote it using an example from the documentation of the specific React component library I was using:

```js
const hasBooking = bookings?.some(booking => 
    booking.startTime.getFullYear() === date.getFullYear() &&
    booking.startTime.getMonth() === date.getMonth() &&
    booking.startTime.getDate() === date.getDate()
);
```

This produced the expected result, but then I thought about making the code more concise. I checked in with ChatGPT and read what suggestions it had. It had the following:

```js
const hasBooking = bookings?.some(booking =>
    booking.startTime.toISOString().split('T')[0] === date.toISOString().split('T')[0]
);
```

This appeared like a more concise and readable code, but then the chatbot mentioned that this was a more expensive operation (though for small datasets the performance hit is neglibable, but at this stage I was theoretically intruiged), and inquired further as to why this is a more expensive operation.

I learned then that date objects are basically made up of numbers and a function that extracts numbers is much more cost efficient than one that takes those numbers and converts them to strings (and then makes sure that these adhere to the ISO 8601 string representation) and returns the processed string. I opted then to keep my initial code since, while code aesthetic is important, I don't think it should come before code functionality. 
