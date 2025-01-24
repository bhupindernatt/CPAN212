import lodash from "lodash";
const holiday =[{name: "Christmas", date:new Date("2025-12-25")},
{name: "Canada day", date:new Date("2025-07-01")},
{name: "April Fools", date:new Date("2025-04-01")}

]

let today=new Date();
holiday.forEach(holiday => {
    let dateDifference = holiday.date - today;
    console.log (Math.ceil(dateDifference/(1000 *60*60*24)))
})


let random_holiday=lodash.sample(holiday)
console.log(random_holiday)
console.log(lodash.findIndex(holiday,{name:"Christmas"}))
console.log(lodash.findIndex(holiday,{name:"Canada day"}))

