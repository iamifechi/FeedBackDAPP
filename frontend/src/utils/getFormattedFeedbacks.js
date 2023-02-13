import { getTimeSince } from "./getTimeSince"

export const formatFeedbacks = (feedbacks) => feedbacks.map(feedback => {
        return {
        sender:feedback.sender,
        feedback: feedback.message,
        time: getTimeSince(feedback.timestamp),
        }
       
    })