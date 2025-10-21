# Courses Data

The courses data structure contains comprehensive information about all PADI scuba diving courses offered by Ocean Spirit Scuba, including pricing, requirements, curriculum, and course details.

## Course Structure

Each course object contains the following properties:

```javascript
{
  id: 'discover-scuba',                    // Unique identifier
  name: 'Discover Scuba Diving',           // Full course name
  tagline: 'Try diving for the first time', // Short marketing description
  price: 4500,                             // Price in MUR
  duration: '1 day',                       // Course duration
  minAge: 10,                              // Minimum age requirement
  prerequisites: 'None - No experience required', // Entry requirements
  maxDepth: '12m',                         // Maximum certified depth
  certification: 'Experience recognition', // Certification type
  image: 'https://...',                    // Course image URL
  description: '...',                      // Detailed course description
  included: ['...', '...'],                // What's included in the price
  curriculum: ['...', '...']               // Course curriculum topics
}
```

## Available Courses

### COURSES Array

```javascript
import { COURSES } from '@/data/courses';

// Access all courses
console.log(COURSES.length); // 5 courses
```

### Course List

| Course ID        | Name                      | Duration  | Price (MUR) | Min Age | Max Depth |
| ---------------- | ------------------------- | --------- | ----------- | ------- | --------- |
| `discover-scuba` | Discover Scuba Diving     | 1 day     | 4,500       | 10      | 12m       |
| `open-water`     | Open Water Diver          | 3-4 days  | 15,000      | 10      | 18m       |
| `advanced`       | Advanced Open Water Diver | 2-3 days  | 12,000      | 12      | 30m       |
| `rescue`         | Rescue Diver              | 3-4 days  | 14,000      | 12      | 30m       |
| `divemaster`     | Divemaster Course         | 6-8 weeks | 45,000      | 18      | 40m       |

## Helper Functions

### Get Course by ID

```javascript
import { getCourseById } from '@/data/courses';

// Get specific course details
const openWater = getCourseById('open-water');
console.log(openWater.name); // "Open Water Diver"
console.log(openWater.price); // 15000
```

**Parameters:**

- `id` (string): Course ID

**Returns:** Course object or `undefined` if not found

### Get Courses by Level

```javascript
import { getCoursesByLevel } from '@/data/courses';

// Get beginner courses
const beginnerCourses = getCoursesByLevel('beginner');
// ['discover-scuba', 'open-water']

// Get intermediate courses
const intermediateCourses = getCoursesByLevel('intermediate');
// ['advanced', 'rescue']

// Get professional courses
const professionalCourses = getCoursesByLevel('professional');
// ['divemaster']
```

**Parameters:**

- `level` (string): 'beginner', 'intermediate', or 'professional'

**Returns:** Array of course objects

## Course Details

### Discover Scuba Diving

```javascript
const discoverScuba = getCourseById('discover-scuba');
```

**Key Features:**

- **Duration:** 1 day
- **Prerequisites:** None
- **Max Depth:** 12m
- **Included:** Theory, confined water practice, open water dive, equipment, supervision
- **Curriculum:** Basic principles, equipment, breathing techniques, safety, marine life

### Open Water Diver

```javascript
const openWater = getCourseById('open-water');
```

**Key Features:**

- **Duration:** 3-4 days
- **Prerequisites:** None
- **Max Depth:** 18m
- **Included:** eLearning, 5 confined water dives, 4 open water dives, certification
- **Curriculum:** Equipment, physics, buoyancy, navigation, safety, planning

### Advanced Open Water Diver

```javascript
const advanced = getCourseById('advanced');
```

**Key Features:**

- **Duration:** 2-3 days
- **Prerequisites:** Open Water Diver certification
- **Max Depth:** 30m
- **Included:** 5 adventure dives, 3 specialty dives, dive computer training
- **Curriculum:** Deep diving, navigation, buoyancy, specialties

### Rescue Diver

```javascript
const rescue = getCourseById('rescue');
```

**Key Features:**

- **Duration:** 3-4 days
- **Prerequisites:** Advanced Open Water + EFR
- **Max Depth:** 30m
- **Included:** Rescue scenarios, EFR course, emergency management
- **Curriculum:** Self-rescue, stress management, emergency procedures

### Divemaster Course

```javascript
const divemaster = getCourseById('divemaster');
```

**Key Features:**

- **Duration:** 6-8 weeks
- **Prerequisites:** Rescue Diver + 40 logged dives + EFR
- **Max Depth:** 40m
- **Included:** Professional training, insurance, registration
- **Curriculum:** Physics, equipment, supervision, teaching, management

## Usage in Components

### Course Cards Component

```javascript
import { COURSES } from '@/data/courses';
import { useCurrency } from '@/hooks/useCurrency';

function CourseCards() {
  const { convert, format } = useCurrency();

  return (
    <div className="course-grid">
      {COURSES.map((course) => (
        <div key={course.id} className="course-card">
          <img src={course.image} alt={course.name} />
          <h3>{course.name}</h3>
          <p className="tagline">{course.tagline}</p>
          <div className="course-details">
            <span>Duration: {course.duration}</span>
            <span>Price: {format(convert(course.price))}</span>
          </div>
          <p className="description">{course.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Course Comparison Table

```javascript
import { COURSES, COURSE_COMPARISON_HEADERS } from '@/data/courses';

function CourseComparison() {
  return (
    <table className="course-comparison">
      <thead>
        <tr>
          {COURSE_COMPARISON_HEADERS.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {COURSES.map((course) => (
          <tr key={course.id}>
            <td>{course.name}</td>
            <td>{course.duration}</td>
            <td>{course.minAge}+</td>
            <td>{course.prerequisites}</td>
            <td>{course.maxDepth}</td>
            <td>₨{course.price.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Course Detail Page

```javascript
import { getCourseById } from '@/data/courses';

function CourseDetailPage({ courseId }) {
  const course = getCourseById(courseId);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="course-detail">
      <img src={course.image} alt={course.name} />
      <h1>{course.name}</h1>
      <p className="tagline">{course.tagline}</p>

      <div className="course-info">
        <div>Duration: {course.duration}</div>
        <div>Price: ₨{course.price.toLocaleString()}</div>
        <div>Min Age: {course.minAge}</div>
        <div>Max Depth: {course.maxDepth}</div>
        <div>Prerequisites: {course.prerequisites}</div>
      </div>

      <p className="description">{course.description}</p>

      <div className="curriculum">
        <h3>What You'll Learn</h3>
        <ul>
          {course.curriculum.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="included">
        <h3>What's Included</h3>
        <ul>
          {course.included.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## Course Categories

Courses are organized by experience level:

- **Beginner:** Discover Scuba, Open Water Diver
- **Intermediate:** Advanced Open Water, Rescue Diver
- **Professional:** Divemaster

## Pricing Information

- All prices are in Mauritian Rupees (MUR)
- Prices include equipment rental and instruction
- Additional fees may apply for:
  - Certification cards and materials
  - Marine park fees
  - Transportation
  - Accommodation (if requested)
