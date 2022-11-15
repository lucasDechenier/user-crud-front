import Api from "./Api";

export default {
  base: 'student',

  create(student){
    const {firstNote, secondNote, name} = student
    return Api().post(this.base, {
      firstNote: parseFloat(firstNote), 
      secondNote: parseFloat(secondNote), 
      name
    })
    .then((response) => response.data)
  },

  list(status){
    if(status && ['approved', 'disapproved', 'recovery'].includes(status)){
      return Api().get(`${this.base}/${status}`).then((response) => response.data)
    }else{
      return Api().get(`${this.base}`).then((response) => response.data)
    }
  },

  show(studentId){
    return Api().get(`${this.base}/${studentId}`).then((response) => response.data)
  },

  delete(id){
    return Api().delete(`${this.base}/${id}`).then((response) => response.data)
  },
  
  update(student){
    const {firstNote, secondNote, name, _id} = student
    return Api().put(`${this.base}/${_id}`, {firstNote, secondNote, name})
    .then((response) => response.data)
  },
}