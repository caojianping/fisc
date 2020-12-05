//航班号正则
// export const FlightNORegExp = /[A-Z]*[0-9]*/
export const FlightNORegExp = /.*/;

//最小航班量正则
export const MinNumberRegExp = /^\d*$/;

//机场三字码、四字码正则
export const ICAOCodeRegExp = /^[A-Z]{3,4}$/;

//航司二字码正则
// export const AirlineCodeRegExp = /^[A-Z]{2}$/
export const AirlineCodeRegExp = /.*/;

//飞机型号正则
// export const AirplaneModelRegExp = /^[A-Z0-9]*$/
export const AirplaneModelRegExp = /.*/;

//密码正则：字母数字6-20位组合
export const PasswordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;