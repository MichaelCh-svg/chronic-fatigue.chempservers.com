<template>
<div class="main">
  <div class="header" v-if="photos.length===0">
    <div class="menu">
      <p><a @click="toggleUpload"><i class="fas fa-image">Share your story.</i></a></p>
      <h2>{{user.firstName}} {{user.lastName}} <a @click="logout"><i class="fas fa-sign-out-alt"></i></a></h2>
      <uploader :show="show" @close="close" @uploadFinished="uploadFinished" />
    </div>
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
        </div>
    </div>
  </div>
  <div v-else>
    <div class="menu">
      <h2>Edit the {{photos[0].title}} story</h2>
      <h2>{{user.firstName}} {{user.lastName}} <a @click="logout"><i class="fas fa-sign-out-alt"></i></a></h2>
      <uploader :show="show" @close="close" @uploadFinished="uploadFinished" />
    </div>
      
      <div class ="sickness">
        
        <input class="sickness_name" v-model="photos[0].title" :placeholder="photos[0].title">
        <img :src="photos[0].path" />
        <textarea v-model="photos[0].description" :placeholder="photos[0].description"></textarea>
        <div class="actions">
          <button @click="deleteStory(photos[0])">Delete</button>
          <button @click="editStory(photos[0])">Edit</button>
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
      photos: [],
      error: '',
      text: '',
      symptoms: [],
      symptom: '',
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
    async editStory(story) {
      try {
        await axios.put("/api/photos/" + story._id, {
          title: this.photos[0].title,
          description: this.photos[0].description,
        });
        this.getSickness();
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
