<template>
  <section class="d-flex fill-height flex-grow"
           style="background-color: #F8F8F8;">
    <navigation></navigation>
    <section class="d-flex fill-height flex-grow flex-column">
      <header class="d-flex justify-center justify-space-between px-6 py-4">
        <section>
          <v-text-field
            v-model="search"
            label="Buscar"
            placeholder="Buscar"
            clearable
            color="#FEAF00"
            dense solo
            hide-details
            @click:clear="search = ''"
          ></v-text-field>
        </section>
        <v-btn
          class="bg-primary color-white"
          elevation="0"
          @click="changeDialog(true)"
        >
          Novo estudante
        </v-btn>
      </header>
      <section class="d-flex flex-column overflow-auto flex-grow px-6 pt-4 pb-6">
        <v-data-table
          :headers="headers"
          :items="filteredStudents"
          no-data-text="Nenhum aluno encontrado"
          sort-by="calories"
          class="elevation-1"
          :footer-props="{
            'items-per-page-text':'Estudantes por página'
          }"
        >
          <template #[`item.situation`]="{ item }">
            <section class="d-flex" style="max-width: 120px;">
              <v-chip
                class="justify-center flex-grow font-12--normal"
                :class="setColor(item.situation)"
                label
                small
              >
                {{ getSituation(item.situation) }}
              </v-chip>
            </section>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <icon-btn
                  small
                  icon="far fa-edit"
                  class="mr-2 color-primary"
                  @click="editStudent(item)"
                  v-on="on"
                >
                </icon-btn>
              </template>
              <span>Editar estudante</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <icon-btn
                  small
                  icon="far fa-trash-alt"
                  class="color-primary"
                  @click="deleteStudent(item)"
                  v-on="on"
                >
                </icon-btn>
              </template>
              <span>Apagar estudante</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </section>
    </section>


    <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
    >
      <section class="d-flex flex-column bg-white py-2">
        <header class="px-5 d-flex">
          <span class="color-black font-16--bold py-2">
            {{ edit ? 'Editar estudante': 'Criar estudante' }}
          </span>
        </header>
        <section class="d-flex flex-column overflow-auto flex-grow px-5 pb-2" style="max-height: 60vh;">
          <v-form ref="form">
            <div class="mb-2">
              <div class="color-black font-14--bold mb-2">
                <label>Nome:</label>
              </div>
              <v-text-field
                v-model="editedStudent.name" label=""
                filled rounded
                :loading="loading"
                class=" bra-3 mb-n3" color="#FEAF00"
                :rules="[required]"
              ></v-text-field>
            </div>
            <div class="mb-2">
              <div class="color-black font-14--bold mb-2">
                <label>Primeira nota:</label>
              </div>
              <v-text-field
                v-model="editedStudent.firstNote" label=""
                filled rounded
                :loading="loading"
                class="color-black bra-3 mb-n3" color="#FEAF00"
                type="number"
                :rules="numberRules"
              ></v-text-field>
            </div>
            <div class="mb-2">
              <div class="color-black font-14--bold mb-2">
                <label>Segunda nota:</label>
              </div>
              <v-text-field
                v-model="editedStudent.secondNote" label=""
                filled rounded
                :loading="loading"
                class="color-primary bra-3 mb-n3" color="#FEAF00"
                type="number"
                :rules="numberRules"
              ></v-text-field>
            </div>
          </v-form>
        </section>
        <footer class="d-flex align-center justify-space-between px-6 bg-white pt-3 pb-4">
          <v-btn
            outlined
            :loading="loading"
            class="color-red px-8"
            @click="changeDialog(false)"
          >
            Cancelar
          </v-btn>
          <v-btn
            outlined
            :loading="loading"
            class="color-green px-6"
            @click="createStudent"
          >
            {{ edit ? 'Atualizar' : 'Cadastrar' }}
          </v-btn>
        </footer>
      </section>
    </v-dialog>
  </section>
</template>

<script>

import Navigation from "@/components/Navigation"
import StudentService from "@/services/StudentService"
import {required} from "@/utils/validations";
import { cloneDeep } from 'lodash'
import IconBtn from "@/components/IconBtn"

export default {
  name: "Home",
  components: { Navigation, IconBtn },
  data() {
    return {
      students: [],
      search: '',
      headers: [
        {text: 'Nome', value: 'name'},
        {text: 'Primeira nota', value: 'firstNote'},
        {text: 'Segunda nota', value: 'secondNote'},
        {text: 'Média', value: 'average'},
        {text: 'Situação', value: 'situation'},
        {text: 'Ações', value: 'actions', sortable: false},
      ],
      editedStudent: {
        name: '',
        firstNote: null,
        secondNote: null
      },
      defaultStudent: {
        name: '',
        firstNote: null,
        secondNote: null
      },
      dialog: false,
      loading: false,
      edit: false,
    }
  },
  computed: {
    filter() {
      return this.$route.query.filter || null
    },
    filteredStudents() {
      return this.students.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase()))
    },
    numberRules(){
      return [
        (v) => required(v),
        (v) => {
          if(v > 10) return 'Valor não pode ser superior a 10'
          else if(v < 0) return 'Valor não pode ser inferior a 0'
          else return true
        }
      ]
    }
  },
  watch: {
    filter: {
      handler(){
        this.getStudents()
      },
      immediate: true,
    },
  },
  methods: {
    required: required,
    getStudents(){
      StudentService.list(this.filter).then(data => {
        this.students = data
      })
    },
    editStudent(student){
      this.editedStudent = cloneDeep(student)
      this.changeDialog(true, true)
    },
    changeDialog(value, edit = false){
      this.$refs?.form?.resetValidation()
      this.edit = edit
      this.dialog = value;
      this.$nextTick(() => {
        if(!edit) this.editedStudent = cloneDeep(this.defaultStudent)
      })
    },
    createStudent(){
      if(!this.$refs?.form?.validate()) return
      this.loading = true
      if(this.editedStudent._id){
        StudentService.update(this.editedStudent).then(() => {
          this.alertSuccess({title: 'Estudante atualizado com sucesso'})
          this.getStudents()
        }).finally(() => {
          this.changeDialog(false)
          this.loading = false
        })
      }else{
        StudentService.create(this.editedStudent).then(() => {
          this.alertSuccess({title: 'Estudante adicionado com sucesso'})
          this.getStudents()
        }).finally(() => {
          this.changeDialog(false)
          this.loading = false
        })
      }
    },
    deleteStudent(student){
      this.confirm({text: `Deseja mesmo apagar o estudante '${student.name}'?`}, () =>{
        this.loading = true
        StudentService.delete(student._id).then(() => {
          this.alertSuccess({title: 'Estudante removido com sucesso'})
          this.getStudents()
        }).finally(() => {
          this.changeDialog(false)
          this.loading = false
        })
      })
    },
    getSituation(situation){
      const options = {
        approved: 'Aprovado',
        disapproved: 'Reprovado',
        recovery: 'Em recuperação'
      }
      return options[situation] || 'Status inválido'
    },
    setColor(situation) {
      const options = {
        approved: 'bg-green',
        disapproved: 'bg-red',
        recovery: 'bg-grey'
      }
      return options[situation] || 'bg-primary'
    },
  },
}
</script>