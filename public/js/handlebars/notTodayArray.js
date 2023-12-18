export default function notTodayArray(elements) {
    if (elements === undefined) {
        return elements;
    }

    const today = new Date();

    const isToday = (dateString) => {
        const notificationDate = new Date(dateString);
        return (
            notificationDate.getDate() === today.getDate() &&
            notificationDate.getMonth() === today.getMonth() &&
            notificationDate.getFullYear() === today.getFullYear()
        );
    };

    const todayElements = elements.filter((element) =>
        isToday(element.created_at)
    );

    return todayElements;
}
