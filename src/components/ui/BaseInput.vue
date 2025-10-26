<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- Left Icon Slot -->
      <div
        v-if="$slots.leftIcon"
        class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 dark:text-gray-500"
      >
        <slot name="leftIcon" />
      </div>

      <!-- Input Field -->
      <input
        :id="id"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        :class="inputClasses"
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors dark:text-white"
      />

      <!-- Right Icon Slot or Password Toggle -->
      <div
        v-if="$slots.rightIcon || (type === 'password' && showPasswordToggle)"
        class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <slot name="rightIcon">
          <!-- Password Toggle Button -->
          <button
            v-if="type === 'password' && showPasswordToggle"
            type="button"
            @click="togglePasswordVisibility"
            class="flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
          >
            <Eye v-if="!isPasswordVisible" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </slot>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>

    <!-- Helper Text -->
    <p v-else-if="hint" class="text-gray-500 dark:text-gray-400 text-xs mt-1">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

export interface BaseInputProps {
  id?: string
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  autocomplete?: string
  showPasswordToggle?: boolean
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  type: 'text',
  showPasswordToggle: true,
  autocomplete: 'off',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const slots = useSlots()
const isPasswordVisible = ref(false)

const computedType = computed(() => {
  if (props.type === 'password' && isPasswordVisible.value) {
    return 'text'
  }
  return props.type
})

const inputClasses = computed(() => {
  const classes = []

  // Padding adjustments for icons
  if (slots.leftIcon) {
    classes.push('pl-10')
  }
  if (slots.rightIcon || (props.type === 'password' && props.showPasswordToggle)) {
    classes.push('pr-10')
  }

  // Border color based on state
  if (props.error) {
    classes.push(
      'border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700'
    )
  } else if (props.disabled) {
    classes.push(
      'border-gray-200 bg-gray-50 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800'
    )
  } else {
    classes.push(
      'border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-500'
    )
  }

  return classes.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
