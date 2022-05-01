function getAge(dateString) 
{
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}
const dateFormatter = (date) => {
  const month = ["Januari",  "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  const temp = new Date(date);
  const tanggal = temp.getDate()
  const index = temp.getMonth()
  const year = temp.getFullYear()

  return `${tanggal} ${month[index]} ${year}`
}

export{getAge, dateFormatter}