<template>
    <div>
        <h2>Register</h2>
    <form v-on:submit.prevent="register($event)">
        <div><label>E-Mail <input v-model="email" id="register-email" type="email"/></label></div>
        <div><label>Password <input v-model="password" id="register-password" type="password"/></label></div>
        <button>Register</button>
    </form>
    </div>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  data () {
    return { email: '', password: '' }
  },
  head () {
    return {
      title: 'Register'
    }
  },
  methods: {
    async register () {
      try {
        const res = await axios.post('/api/auth/local/register', {
          email: this.email,
          password: this.password
        })
        alert(res.data.message)
        this.$router.push('/login')
      } catch ({response}) {
        alert(response.data.message)
      }

    //   console.log(res);
    //   if (res.status === "error") alert(res.message);
    //   else console.log(res);
    }
  }
}
</script>