<template>
<div class="main">
  <div class="header" v-if="photos.length===0">
    <div class="menu">
      <p><a @click="toggleUpload"><i class="fas fa-image">Share your story.</i></a></p>
      <button class='logout' @click="logout">{{user.firstName}} {{user.lastName}}Logout</button>
      <uploader :show="show" @close="close" @uploadFinished="uploadFinished" />
    </div>
    <div class='story'>
      <div>
        <h1>Sample story</h1>
      </div>
      <div class="page_top">
      <br>
          <img src='./sleeping-cat.jpg'>
          <div class="photoInfo">
            <p class="photoTitle">Chronic Fatigue</p>
            <p class="photoTitle">All cats have chronic fatigue. This makes them nocturnal.</p>
            <p class="photoName">Jake Sandwich</p>
            <ul>
              <li>Fatigue</li>
              <li>stress</li>
              <li>difficulty sleeping</li>
            </ul>
          </div>
      </div>
      </div>
  </div>
  <div v-else>
    <div class="menu">
      <h2>Edit the {{photos[0].title}} story</h2>
       <button class='logout' @click="logout">{{user.firstName}} {{user.lastName}}Logout</button>
      <uploader :show="show" @close="close" @uploadFinished="uploadFinished" />
    </div>
      
      <div class ="sickness">
        
        
        <div v-if='editing_title' class="description">
          <input class="sickness_name" v-model="photos[0].title" :placeholder="photos[0].title">
          <button class='edit-button' @click="editStory(photos[0])">Finish Edit</button>
        </div>
        <div v-else class="description">
          <h1>{{photos[0].title}}</h1>
          <button class='edit-button' @click="toggleEditTitle">Edit</button>
        </div>
        <img :src="photos[0].path" />
        <div v-if='editing_description' class="description">
          <textarea v-model="photos[0].description"></textarea>
          <button class='edit-button' @click="editStory(photos[0])">Finish Edit</button>
        </div>
        <div v-else class="description">
          <p>{{photos[0].description}}</p>
          <button class='edit-button' @click="toggleEditDescription">Edit</button>
        </div>
        <div class="actions">
          <button @click="deleteStory(photos[0])">Delete</button>
          
          <hr style = emphas>
          <br>
        </div>
        <div class = "symptoms">
          <form @submit.prevent="addSymptom">
            <input type="text" v-model="symptom">
            <button type="submit">Add symptom</button>
          </form>
          <ul>
            <li v-for="symptom in symptoms" :key="symptom.id">
              <label>
                {{ symptom.text }}
              </label>
              <button @click="deleteSymptom(symptom)" class="delete">Delete</button>
            </li>
          </ul>
        </div>
      </div>
      
  </div>
  <p v-if="error">{{error}}</p>
</div>
</template>

<script>
import axios from 'axios';
import Uploader from '@/components/Uploader.vue';

export default {
  name: 'MyPhotos',
  components: {
    Uploader,
  
  },
  data() {
    return {
      show: false,
      photos: [{description: ''}],
      error: '',
      text: '',
      symptoms: [],
      symptom: '',
      editing_description: false,
      editing_title: false,
    }
  },
  created() {
    this.getSickness();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    toggleEditDescription(){
      this.editing_description = true;
    },
    toggleEditTitle(){
      this.editing_title = true;
    },
    async editStory(story) {
      try {
        await axios.put("/api/photos/" + story._id, {
          title: this.photos[0].title,
          description: this.photos[0].description,
        });
        this.getSickness();
        this.editing_description=false;
        this.editing_title=false;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteSymptom(symptom) {
      try {
        await axios.delete(`/api/photos/${this.photos[0]._id}/symptoms/${symptom._id}`);
        this.getSymptoms();
      } catch (error) {
        console.log(error);
      }
    },
     async addSymptom() {
      try {
        await axios.post(`/api/photos/${this.photos[0]._id}/symptoms`, {
          text: this.symptom,
        });
        this.symptom = "";
        this.getSymptoms();
      } catch (error) {
        console.log(error);
      }
    },
    async getSymptoms() {
      try {
        const response = await axios.get(`/api/photos/${this.photos[0]._id}/symptoms`);
        this.symptoms = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteStory(story) {
      try {
        await axios.delete("/api/photos/" + story._id);
        this.getPhotos();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async getSickness() {
      await this.getPhotos();
      await this.getSymptoms();
    },
    async getPhotos() {
      try {
        this.response = await axios.get("/api/photos");
        this.photos = this.response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    close() {
      this.show = false;
    },
    toggleUpload() {
      this.show = true;
    },
    async uploadFinished() {
      this.show = false;
      this.getPhotos();
    },
  }
}
</script>

<style scoped>
img{
  max-width:500px;
  max-height:300px;
}
input, textarea{
  border-style:solid;
}
.logout{
  padding:6px;
  border-style:solid;
  border-width:6px;
  border-color:slategray;
  height:50px;
  margin-bottom:10px;
}
.sickness, .story{
  display:flex;
  flex-wrap:wrap;
  flex-direction:column;
  align-content:center;
  justify-content:space-around;
}
.sickness_name{
  width: 260px;
  align-self:center;
  margin:10px;
}
button{
  height:30px;
}
.edit-button{
  align-self:center;
}
.description{
  display:flex;
  flex-wrap:wrap;
  flex-direction:row;
  border-style:solid;
  justify-content:space-around;
}
textarea{
  margin:6px;
  width:70%;
}
.menu {
  display: flex;
  justify-content: space-between;
  /* border-style:solid; */
  width:100%;
}

.menu h2 {
  font-size: 14px;
}
.header{
  display:flex;
  flex-wrap:wrap;
  flex-direction:row;
  margin-bottom:60px;
}
</style>
