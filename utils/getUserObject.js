const getUserAge = (month, year) => {
  const curr_year = new Date().getFullYear();
  const curr_month = new Date().getMonth() + 1;

  return (curr_year - year - 1) + parseInt((12 - month + curr_month) / 12);
};

module.exports = (user) => {
  return {
    _id: user._id,
    name: user.name,
    age: getUserAge(user.birth_time.month, user.birth_time.year),
    school: user.school,
    not_read_message_number: user.not_read_message_number,
    birth_day: user.birth_time.day + "." + user.birth_time.month + "." + user.birth_time.year,
    completed: user.completed,
    profile_photo: user.profile_photo,
    languages: user.languages
  }
};
