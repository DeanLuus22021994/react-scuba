import { COURSES } from '../../data/courses';
import { useCurrency } from '../../hooks/useCurrency';

const CourseComparison = () => {
    const { format } = useCurrency();

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-ocean-600">
                <h3 className="text-2xl font-bold text-white">Course Comparison</h3>
                <p className="text-ocean-100 mt-2">Compare all our PADI courses at a glance</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Min Age
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prerequisites
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Max Depth
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {COURSES.map((course, index) => (
                            <tr
                                key={course.id}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{course.name}</div>
                                    <div className="text-sm text-gray-500">{course.certification}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {course.duration}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {course.minAge} years
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                    {course.prerequisites}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {course.maxDepth}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-semibold text-ocean-600">
                                        {format(course.price)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseComparison;
