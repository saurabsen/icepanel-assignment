<!-- src/views/SplitBill.vue -->
<template>
  <section class="bg-white dark:bg-gray-900 h-full">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div
        class="flex justify-between pb-6 items-baseline max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400"
      >
        <a @click="$router.back()"><ArrowLeft color="#ffffff" /></a>
      </div>
      <div
        class="flex justify-between items-baseline max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400"
      >
        <div>
          <h5>Split bill</h5>
          <h2
            class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white"
          >
            {{ item.name }}
          </h2>
        </div>

        <p class="mb-4 font-medium">${{ item.amount }}</p>
      </div>
      <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        <li class="pb-3 sm:pb-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div
              class="flex-shrink-0"
              style="background: #1ac0c0; border-radius: 8px; padding: 8px"
            >
              <Wifi color="#ffffff" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 truncate dark:text-white"
              >
                Nearby friends
              </p>
            </div>
          </div>
        </li>
      </ul>
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{
          item?.splitBetween?.length === 0
            ? "Contacts"
            : "Bill splitted between"
        }}
      </h4>
      <form @submit.prevent="submitSplit">
        <ul
          v-if="item?.splitBetween?.length === 0"
          v-for="contact in contacts"
          :key="contact._id"
          class="my-4 max-w-md divide-y divide-gray-200 dark:divide-gray-700"
        >
          <li class="pb-3 sm:pb-4">
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              <div class="flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start sm:items-center">
                  <input
                    id="terms-checkbox-2"
                    type="checkbox"
                    :value="contact._id"
                    v-model="selectedContacts"
                    class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                  />
                  <label
                    for="terms-checkbox-2"
                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {{ contact.name }}
                  </label>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <ul
          v-if="item?.splitBetween?.length !== 0"
          v-for="contact in item?.splitBetween"
          :key="contact._id"
          class="my-4 divide-y divide-gray-200 dark:divide-gray-700"
        >
          <li class="pb-3 sm:pb-4">
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              <div class="flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start sm:items-center">
                  <div>
                    <input
                      v-if="item?.splitBetween?.length === 0"
                      id="terms-checkbox-2"
                      type="checkbox"
                      :value="contact._id"
                      v-model="selectedContacts"
                      class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                    />
                    <label
                      for="terms-checkbox-2"
                      class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {{ contact.user.name }}
                    </label>
                  </div>
                  <div class="flex justify-center items-center">
                    <span
                      class="ms-2 mx-4 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >$ {{ contact.amountOwed }}</span
                    >
                    <button
                      v-if="
                        contact.user._id === user.id && contact.amountOwed !== 0
                      "
                      class="mt-4 flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <button
          v-if="item?.splitBetween?.length === 0"
          type="submit"
          class="mt-4 max-w-screen-lg flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0"
        >
          Split
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Wifi, ArrowLeft } from "lucide-vue-next";
const backend_url = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
import setupAxiosInstance from "./../utils/api";

const api = setupAxiosInstance();

const route = useRoute();
const item = ref({});
const contacts = ref([]);
const selectedContacts = ref([]);

onMounted(async () => {
  const itemResponse = await api.get(
    `${backend_url}/items/${route.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  item.value = itemResponse.data;
  const contactsResponse = await api.get(
    `${backend_url}/users/${itemResponse.data.paidBy}/contacts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  contacts.value = contactsResponse.data;
});

const submitSplit = async () => {
  try {
    await api.post(
      `${backend_url}/bills/split`,
      {
        contacts: selectedContacts.value,
        itemId: item.value._id,
        amount: item.value.amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Bill split successfully!");
  } catch (error) {
    console.error("Error splitting the bill:", error);
    alert("Error splitting the bill. Please try again.");
  }
};
</script>
