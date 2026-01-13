  export const getPerformanceMessage = (percentage:number) => {
    if (percentage >= 90) return { text: 'Outstanding! 🎉', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (percentage >= 75) return { text: 'Great Job! 👏', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (percentage >= 60) return { text: 'Good Effort! 💪', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    return { text: 'Keep Practicing! 📚', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
  };
