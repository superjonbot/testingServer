<template>
  <div class="test">

    <input type="text" v-model="title"> </br>

    <h1>{{title}}</h1>
    <p>{{user.first_name}}</p>
    <p v-if="showName">{{user.first_name}}</p>
    <p v-else="showName">nobody</p>
    <ul><li v-for="item in items">{{item.title}}</li></ul>
    <button v-on:click="greet(title)">Say Greeting</button>
    <br />
    <input type="text" v-on:keyup="presskey" v-on:keyup.enter="enterHit">
    <hr />
    <label>First Name: </label><input type="text" v-model="user.first_name">
    <br />
    <label>First Name: </label><input type="text" v-model="user.last_name">
<h3>{{fullName}}</h3>

   <h2>{{msg}}</h2>
  </div>
</template>

<script>
export default {
  name: 'test',
    props:{
      msg:{
          type: String,
          default:'Foobar'
      }
    },
    data(){
      return {title:'Hello World',
      user:{
          first_name:'John',
          last_name: 'Doe'
      },
      showName:false,
      items:[
          {title:'Item One'},
          {title:'Item Two'},
          {title:'Item Three'}
      ]

      }
    },
    methods:{
      greet: function(value){
          alert('Hello '+value)
      },
      presskey:function(e){
          console.log(e.target.value);
      },
      enterHit: function () {
          console.log('You hit enter')
      }
    },
    computed:{
      fullName: function(){
          return this.user.first_name + ' '+this.user.last_name
      }
    }
}
</script>

<style scoped>


</style>