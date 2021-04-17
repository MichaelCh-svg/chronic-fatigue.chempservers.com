<template>
  <div class="home">
    <h1>Cases of Chronic Fatigue</h1>
      <p>Since diagnosing one's fatigue can be difficult, this platform
        provides users with an opportunity to read and share their diagnosis stories
        and compare symptoms if in search of a diagnosis. </P>
    <image-gallery :photos="photos" />
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import ImageGallery from '@/components/ImageGallery.vue';

export default {
  name: 'Home',
  components: {
    ImageGallery,
  },
  data() {
    return {
      photos: [],
      error: '',
    }
  },
  created() {
  this.getPhotos();
  },
  methods: {
    async getPhotos() {
      try {
        let response = await axios.get("/api/photos/all");
        this.photos = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  }
}
</script>
