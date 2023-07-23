### Comparing dates in javascript (added to blog)
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

### Generics
Generics in types - Multiple generics in types/types

You can use generics in types to make them more flexible. It turns them into a kind of function, which can return different types depending on what you pass in.
https://www.typescriptlang.org/docs/handbook/2/generics.html

### Dynamic class input into tailwind css
Tailwind CSS does not support dynamic input. When I attempted to insert width sizes dynamically into components, as so:

```ts
className={`card w-64 sm:w-${size} bg-base-100 border-2 border-red-500`}
```

But injecting entire classes using a ternary operator controlled by a bool appears to do the trick.

```ts
className={`card w-64 ${wider ? "sm:w-96" : "sm:w-80"} bg-base-100 border-2 border-red-500`}
```

More information:
https://stackoverflow.com/questions/71818458/why-wont-tailwind-find-my-dynamic-class
https://stackoverflow.com/questions/71063619/react-and-tailwind-css-dynamically-generated-classes-are-not-being-applied/71068925#71068925

### Bug where display for phone booths was double
Error was on the frontend, particularly the condition needed additional parameters, such as checking for minutes.

### Bug where react-calendar would retain the previous selection after first-render when switching between rooms
Resolved with putting the `date.justDate` state into the Calendar's `value` prop. This makes it so that when the calendar renders, it takes its inital value from the `date.justDate`, which will be reset to null upon switching rooms. 
```ts
<ReactCalendar
    value={date.justDate}
/>
```