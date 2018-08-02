<template>
    <div>
        <h2>Login</h2>
    <form v-on:submit.prevent="login($event)">
        <div><label>E-Mail <input v-model="email" id="login-email" type="email"/></label></div>
        <div><label>Password <input v-model="password" id="login-password" type="password"/></label></div>
        <button>Login</button>
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
      title: 'Login'
    }
  },
  methods: {
    async login () {
      try {
        const res = await axios.post(
          '/api/auth/local/login',
          {
            username: this.email,
            password: this.password
          },
          { withCredentials: true }
        )
        alert(res.data.message)
        if (this.$route.query && this.$route.query.redirect_to) {
          window.location.href = this.$route.query.redirect_to
        } else this.$route.push('/')
      } catch ({ response }) {
        alert(response.data.message)
      }

      //   console.log(res);
      //   if (res.status === "error") alert(res.message);
      //   else console.log(res);
    }
  }
}
</script>