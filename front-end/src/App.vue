<template>
  <div id="app">
    <header class ="header">
        <div class="routes">
          <router-link to="/">Collection</router-link>
          <router-link to="/dashboard">User/Logout</router-link>
        </div>
        <h1>Chronic Fatigue Diagnosis Successes</h1>
        
      
    </header>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width:800px;
}


/* Color scheme: https://paletton.com/#uid=7040u0knHs+edG7jrvYscpiuCk2 */
/* red: #e74c3c
 * blue: #277E8E
 */
body {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  font-size: 13pt;
  margin: 30px 60px;
}

.header{
  height:110px;
  /* margin:10px; */
  display:flex;
  flex-wrap:wrap;
  flex-direction:column;
  background-color:teal;
  padding:30px;
  /* justify-content:space-around; */
  /* align-items:center; */
}
.routes{
  display:flex;
  justify-content:space-between;
  background-color:turquoise;
  padding:10px;
}

#header {
  /* Semi-circle */
  margin: 0 1em 1em 0;
  height: 100px;
  width: 200px;
  border-bottom-left-radius: 200px;
  border-bottom-right-radius: 200px;
  /* Fixed position */
  position: fixed;
  z-index: 10000;
  left: 50%;
  transform: translate(-50%, 0);
  /* Color and alignment */
  background: #e74c3c;
  text-align: center;
  box-shadow: 0 0 0 1em #FFF;
}

nav {
  display: flex;
  justify-content: center;
}

h1 {
  color: black;
  font-size: 18px;
}

h2 {
  font-size: 12px;
}

#header .fas {
  font-size: 25px;
  color: #fff;
  width: 50px;
}

.pure-button-primary {
  background-color: #277E8E;
}
</style>
