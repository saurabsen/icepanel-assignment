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
        <h2
          class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white"
        >
          {{ item.name }}
        </h2>

        <p class="mb-4 font-medium">${{ item.amount }}</p>
      </div>

      <ul class="max-w-screen-lg divide-y divide-gray-200 dark:divide-gray-700">
        <li class="py-3 sm:pb-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div
              class="flex-shrink-0"
              style="background: #1ac0c0; border-radius: 8px; padding: 8px"
            >
              <Utensils color="#ffffff" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 truncate dark:text-white"
              >
                Dining Out
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                Change Category
              </p>
            </div>
          </div>
        </li>
        <li @click="splitBill" class="py-3 sm:pb-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div
              class="flex-shrink-0"
              style="background: #1ac0c0; border-radius: 8px; padding: 8px"
            >
              <HandCoins color="#ffffff" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 truncate dark:text-white"
              >
                Split this bill
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                Instantly get paid back by your friends
              </p>
            </div>
          </div>
        </li>
        <li class="py-3 sm:pb-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div
              class="flex-shrink-0"
              style="background: #1ac0c0; border-radius: 8px; padding: 8px"
            >
              <List color="#ffffff" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 truncate dark:text-white"
              >
                Add to shared tab
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                A simple way to manage shared experiences
              </p>
            </div>
          </div>
        </li>
        <li class="py-3 sm:pb-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div
              class="flex-shrink-0"
              style="background: #1ac0c0; border-radius: 8px; padding: 8px"
            >
              <Pencil color="#ffffff" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 truncate dark:text-white"
              >
                Add notes
              </p>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                Describe this payment
              </p>
            </div>
          </div>
        </li>
        <li class="py-3 sm:pb-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div
              class="flex-shrink-0"
              style="background: #1ac0c0; border-radius: 8px; padding: 8px"
            >
              <Camera color="#ffffff" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 truncate dark:text-white"
              >
                Add receipt
              </p>
            </div>
          </div>
        </li>
        <li class="py-3 sm:pb-4">
          <a
            href="#"
            class="text-sm font-medium hover:underline text-red-500 truncate dark:text-red-500"
          >
            Don’t recognise this payment? Get help
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  Utensils,
  HandCoins,
  List,
  Pencil,
  Camera,
} from "lucide-vue-next";
const backend_url = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");
import setupAxiosInstance from "./../utils/api";

const api = setupAxiosInstance();

const route = useRoute();
const router = useRouter();
const item = ref({ splitBetween: [] });
const contactDetails = ref([]);

onMounted(async () => {
  const response = await api.get(`${backend_url}/items/${route.params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  item.value = response.data;
});

const splitBill = () => {
  router.push(`/items/${item.value._id}/split`);
};
</script>
