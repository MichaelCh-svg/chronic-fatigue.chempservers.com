<template>
<div>
  <div class="page_top">
  <br>

      <img :src="userPhoto.path" />
      <div class="photoInfo">
        <p class="photoTitle">{{userPhoto.title}}</p>
        <p class="photoTitle">{{userPhoto.description}}</p>
        <p class="photoName">{{userPhoto.user.username}}</p>
      </div>
      <p class="photoDate">{{formatDate(userPhoto.created)}}</p>
      <h2>Symptoms</h2>
      <ul>
        <li v-for="symptom in symptoms" :key="symptom.id">
          <label>
            {{ symptom.text }}
          </label>
        </li>
      </ul>
  </div>
  <div v-if='user' class = 'commentForm'>
    <h2>Enter a comment</h2>
    <form v-on:submit.prevent="addComment()">
      <textarea v-model="description"></textarea>
      <br />
      <button type="submit">Comment</button>
    </form>
  </div>
  <div class = 'comments'>
    <h3>Comments</h3>
    <ul>
      <li v-for="comment in comments" :key="comment._id">
          <p>{{comment.description}}</p>
          <p><i>-- {{comment.user.username}}</i></p>
          <p class="photoDate">{{formatDate(comment.created)}}</p>
          <button v-if='user && user._id===comment.user._id' class="delete" @click="deleteComment(comment)"> delete</button>   
      </li>
    </ul>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'Sickness',
  data() {
    return {
      random: 0,
      amount: 0,
      recipe: {},
      comments: [],
      number: 1,
      addedName: '',
      addedComment: '',
      items: [],
      instructions: [],
      instruction: {},
      drag: {},
      text: "",
      editing: false,
      userPhoto: { user: {username: ''},},
      naem: '',
      description: '',
      symptoms:[],
    }
  },
  async created() {
    this.getSickness();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async getSickness() {
      await this.get_sickness();
      await this.getSymptoms();
    },
    async get_sickness() {
      try {
        console.log("this.%route.params.id: ", this.$route.params.id);
        let response = await axios.get("/api/photos/" + this.$route.params.id);
        this.userPhoto = response.data;
        this.userPhoto.user=response.data.user;
        this.userPhoto.user.username=response.data.user.username;
        await this.getComments();
       return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getSymptoms() {
      try {
        console.log("trying to get symptoms");
        const response = await axios.get(`/api/photos/${this.userPhoto._id}/symptoms`);
        this.symptoms = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },

    //comments
    async deleteComment(comment) {
      try {
        await axios.delete(`/api/photos/${this.userPhoto._id}/comments/${comment._id}`);
        this.getComments();
      } catch (error) {
        console.log(error);
      }
    },
    async editComment(comment) {
      try {
        await axios.put(`/api/photos/${this.userPhoto._id}/comments/${comment._id}`, {
          description: comment.description,
          user: comment.user,
        });
        this.editing=false;

      } catch (error) {
        console.log(error);
      }
    },
    async addComment() {
      try {
        await axios.post(`/api/photos/${this.userPhoto._id}/comments`, {
          description: this.description,

        });
        this.description = "";
        this.getComments();
      } catch (error) {
        console.log(error);
      }
    },
    async getComments() {
      try {
        const response = await axios.get(`/api/photos/${this.userPhoto._id}/comments`);
        this.comments = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>
.page_top{
  background-color:sienna;
  padding:10px;
  padding-top:130px;
}
.commentForm{
margin-bottom: 10px;
}
img{
  max-width:500px;
  max-width:90%;
  max-height: 500px;
}
ol{
  /* background-color:lightsteelblue; */
  padding:5px;
  padding-left:13px;
  border-style:solid;
}
ol li{
  padding:6px;
  padding-left:12px;
}
li{
  /* background-color:lightseagreen; */
  margin-top:25px;
  border-style:solid;
  padding-bottom: 10px;
}
hr{
  background-color:black;
}
.comments{
  /* background-color:sienna; */
  padding-top: 20px;
  padding-bottom: 20px;
}
.intro {
  font-style: italic;
}
.info {
  /* background: #000000; */
  color: #000;
  padding: 10px 30px;
  height: 40px;
  margin-bottom:10px;
}
.products {
  display: flex;
  flex-wrap: wrap;
}
.products img {
  border: 1px solid #333;
  height: 50px;
  width: 40px;
  margin-left: 10px;
  object-fit: cover;
}
textarea {
    width: 90%;
    max-width: 500px;
    height: 100px;
}
form{
  margin-top: 20px;
  display:flex;
  flex-wrap: wrap;
  flex-direction:column;
  align-items: center;
}
 input {
  width: 160px;
}
button{
  width:120px;
}
.delete{
  width:70px;
  background-color:cadetblue;
}
</style>
