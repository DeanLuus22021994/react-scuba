# Booking Types Data

The booking types data structure defines available scuba diving courses and dive experiences offered by Ocean Spirit Scuba, including pricing, duration, and booking options.

## Experience Levels

```javascript
import { EXPERIENCE_LEVELS } from '@/data/bookingTypes';

console.log(EXPERIENCE_LEVELS);
// [
//   'Beginner - Never dived before',
//   'Discover Scuba Diver',
//   'Open Water Diver',
//   'Advanced Open Water Diver',
//   'Rescue Diver',
//   'Divemaster or higher'
// ]
```

**Experience Levels Array:**

- Used in booking forms to assess diver certification level
- Determines course eligibility and pricing
- Maps to PADI certification levels

## Course Bookings

### Available Courses

```javascript
import { BOOKING_TYPES } from '@/data/bookingTypes';

const courses = BOOKING_TYPES.course;
// Array of course objects
```

### Course Structure

```javascript
{
  id: 'discover-scuba',        // Unique identifier
  name: 'Discover Scuba Diving', // Display name
  duration: '1 day',           // Course duration
  price: 4500                  // Price in MUR
}
```

### Course List

| Course ID        | Name                  | Duration  | Price (MUR) |
| ---------------- | --------------------- | --------- | ----------- |
| `discover-scuba` | Discover Scuba Diving | 1 day     | 4,500       |
| `open-water`     | Open Water Diver      | 3-4 days  | 15,000      |
| `advanced`       | Advanced Open Water   | 2-3 days  | 12,000      |
| `rescue`         | Rescue Diver          | 3-4 days  | 14,000      |
| `divemaster`     | Divemaster Course     | 6-8 weeks | 45,000      |

## Dive Bookings

### Available Dives

```javascript
import { BOOKING_TYPES } from '@/data/bookingTypes';

const dives = BOOKING_TYPES.dive;
// Array of dive objects
```

### Dive Structure

```javascript
{
  id: 'single-dive',        // Unique identifier
  name: 'Single Dive',      // Display name
  duration: '2-3 hours',    // Dive duration
  price: 2500               // Price in MUR
}
```

### Dive List

| Dive ID       | Name        | Duration  | Price (MUR) |
| ------------- | ----------- | --------- | ----------- |
| `single-dive` | Single Dive | 2-3 hours | 2,500       |
| `double-dive` | Double Dive | 4-5 hours | 4,000       |
| `night-dive`  | Night Dive  | 2-3 hours | 3,500       |
| `wreck-dive`  | Wreck Dive  | 3-4 hours | 3,000       |

## Helper Functions

### Get Booking Item by ID

```javascript
import { getBookingItemById } from '@/data/bookingTypes';

// Get specific course
const openWater = getBookingItemById('course', 'open-water');
// { id: 'open-water', name: 'Open Water Diver', duration: '3-4 days', price: 15000 }

// Get specific dive
const nightDive = getBookingItemById('dive', 'night-dive');
// { id: 'night-dive', name: 'Night Dive', duration: '2-3 hours', price: 3500 }
```

**Parameters:**

- `type` (string): 'course' or 'dive'
- `id` (string): Booking item ID

**Returns:** Booking item object or `undefined` if not found

### Get All Booking Items

```javascript
import { getBookingItems } from '@/data/bookingTypes';

// Get all courses
const courses = getBookingItems('course');

// Get all dives
const dives = getBookingItems('dive');

// Get dives by default if type not specified
const defaultDives = getBookingItems();
```

**Parameters:**

- `type` (string): 'course' or 'dive' (optional, defaults to 'dive')

**Returns:** Array of booking items

## Usage in Components

### Course Selection Component

```javascript
import { BOOKING_TYPES, getBookingItemById } from '@/data/bookingTypes';
import { useCurrency } from '@/hooks/useCurrency';

function CourseSelector({ selectedCourseId, onCourseSelect }) {
  const { convert, format } = useCurrency();
  const courses = BOOKING_TYPES.course;

  return (
    <div className="course-selector">
      {courses.map((course) => (
        <div key={course.id} className="course-card">
          <h3>{course.name}</h3>
          <p>Duration: {course.duration}</p>
          <p>Price: {format(convert(course.price))}</p>
          <button
            onClick={() => onCourseSelect(course)}
            className={selectedCourseId === course.id ? 'selected' : ''}
          >
            Select
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Booking Form Integration

```javascript
import { EXPERIENCE_LEVELS, getBookingItemById } from '@/data/bookingTypes';

function BookingForm({ bookingType, itemId }) {
  const [experienceLevel, setExperienceLevel] = useState('');
  const bookingItem = getBookingItemById(bookingType, itemId);

  return (
    <form>
      <div>
        <label>Experience Level:</label>
        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
          <option value="">Select your experience</option>
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {bookingItem && (
        <div className="booking-summary">
          <h3>{bookingItem.name}</h3>
          <p>Duration: {bookingItem.duration}</p>
          <p>Price: ₨{bookingItem.price.toLocaleString()}</p>
        </div>
      )}
    </form>
  );
}
```

## Data Structure

### Complete BOOKING_TYPES Object

```javascript
{
  course: [
    { id: 'discover-scuba', name: 'Discover Scuba Diving', duration: '1 day', price: 4500 },
    { id: 'open-water', name: 'Open Water Diver', duration: '3-4 days', price: 15000 },
    { id: 'advanced', name: 'Advanced Open Water', duration: '2-3 days', price: 12000 },
    { id: 'rescue', name: 'Rescue Diver', duration: '3-4 days', price: 14000 },
    { id: 'divemaster', name: 'Divemaster Course', duration: '6-8 weeks', price: 45000 }
  ],
  dive: [
    { id: 'single-dive', name: 'Single Dive', duration: '2-3 hours', price: 2500 },
    { id: 'double-dive', name: 'Double Dive', duration: '4-5 hours', price: 4000 },
    { id: 'night-dive', name: 'Night Dive', duration: '2-3 hours', price: 3500 },
    { id: 'wreck-dive', name: 'Wreck Dive', duration: '3-4 hours', price: 3000 }
  ]
}
```

## Pricing Information

- All prices are in Mauritian Rupees (MUR)
- Prices include equipment rental and instruction
- Additional fees may apply for certification cards and materials
- Group discounts available for multiple participants
