<template lang="pug">
.flex.justify-center.flex-col
  t-card
    template(v-slot:default)
      form(autocomplete="off" @submit="onSubmit")
        .form-item
          t-input-group(label='Name', required)
            t-input(v-model="payload.name" required autofocus)
        .form-item
          t-input-group(label='Expression')
            t-select(
              v-model="payload.policy_expression_name"
              :options="expressions",
              value-attribute='policy_expression_name',
              text-attribute="policy_expression_name"
              required
            )
        .form-item
          t-input-group(label='Function Type')
            t-select(
              v-model.number="payload.function_type"
              :options="functionTypes",
              value-attribute='function_type',
              text-attribute="name"
              required
            )
        .form-item
          t-input-group(label='Function Parameters')
            t-select(
              v-model="payload.function_parameters"
              :options="functionParameters",
              value-attribute='function_parameters',
              text-attribute="function_parameters"
            )
        .form-item
          t-input-group(label='Description')
            t-textarea(v-model="payload.description" name='description')
        .form-item.mt-5
          .flex.justify-between.items-center
            simple-spinner(v-if="isSpinner")
            .flex.gap-x-3(v-else class="w-1/2")
              t-button(type="submit" value="submit" text="Save")
            .end
              t-button(@click="onCancel" type="button" text="Close" variant="error")
</template>

<script>
/* eslint-disable camelcase */
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import SimpleSpinner from '@/components/loaders'

export default {
  props: ['connectionId', 'id'],
  components: {
    SimpleSpinner
  },
  data () {
    return {
      isSpinner: false,
      isValid: false,
      payload: {
        id: +this.id,
        name: '',
        policy_expression_name: '',
        function_type: 1,
        function_parameters: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapGetters('expression', ['expressions']),
    ...mapGetters('func', ['functionTypes', 'functionParameters'])
  },
  methods: {
    ...mapActions('category', ['updateCategory', 'getCategory']),
    ...mapActions('expression', ['getExpressions']),
    ...mapActions('func', ['getFunctionTypes', 'getFunctionParameters']),
    onSubmit (e) {
      e.preventDefault()
      this.isSpinner = true
      this.updateCategory(this.payload).then(() => {
        this.$toast.success('Success. Category created')
      }).finally(() => {
        this.isSpinner = false
      })
    },
    onCancel () { window.history.back() }
  },
  mounted () {
    this.isSpinner = true
    const promises = []
    _.isEmpty(this.expressions) && promises.push(this.getExpressions(this.connectionId))
    _.isEmpty(this.functionTypes) && promises.push(this.getFunctionTypes())
    _.isEmpty(this.functionParameters) && promises.push(this.getFunctionParameters())
    Promise.all([this.getCategory(+this.id), ...promises]).then(([category]) => {
      const {
        name, policy_expression: { policy_expression_name }, description,
        function_type
      } = category
      this.payload = { ...this.payload, name, policy_expression_name, description, function_type }
    }).finally(() => { this.isSpinner = false })
  }
}
</script>

<style lang="postcss">
</style>
