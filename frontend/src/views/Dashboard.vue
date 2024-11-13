<template>
  <Navbar />
  <section class="bg-white dark:bg-gray-900 h-full overflow-scroll">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
        <h2
          class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white"
        >
          $ {{ totalAmount }}
        </h2>

        <p class="mb-4 font-medium">
          <strong class="font-medium text-emerald-400 dark:text-emerald-400"
            >${{ user.savings - totalAmount }}</strong
          >
          left for {{ daysRemainingInMonth() }} days
        </p>
      </div>

      <div class="w-1/2 mb-4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          class="bg-emerald-500 h-2.5 rounded-full"
          :style="{ width: calculateWidth(18, 30) + '%' }"
        ></div>
      </div>

      <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          class="flex items-end flex-wrap -mb-px text-sm font-medium text-center"
          id="default-tab"
          data-tabs-toggle="#default-tab-content"
          role="tablist"
        >
          <li class="me-2" role="presentation">
            <button
              class="inline-block border-b-2 rounded-t-lg bg-red-500"
              :class="
                selectedTab === 'gic'
                  ? 'text-white p-4 border-blue-600 dark:text-white	'
                  : 'text-white  px-4 py-2	 border-gray-300 hover:text-white	'
              "
              @click="selectedTab = 'gic'"
              type="button"
              role="tab"
            >
              GIC
            </button>
          </li>
          <li class="me-2" role="presentation">
            <button
              class="inline-block bg-teal-500 border-b-2 rounded-t-lg"
              :class="
                selectedTab === 'checking'
                  ? 'text-white	p-4 border-blue-600 dark:text-white	'
                  : 'text-white px-4 py-2	 border-gray-300 hover:text-white	'
              "
              @click="selectedTab = 'checking'"
              type="button"
              role="tab"
            >
              Checking account
            </button>
          </li>
          <li class="me-2" role="presentation">
            <button
              class="inline-block bg-green-500 border-b-2 rounded-t-lg"
              :class="
                selectedTab === 'savings'
                  ? 'text-white p-4 border-blue-600 dark:text-white	'
                  : 'text-white px-4 py-2 border-gray-300 hover:text-white	'
              "
              @click="selectedTab = 'savings'"
              type="button"
              role="tab"
            >
              Savings
            </button>
          </li>
        </ul>
      </div>
      <div id="default-tab-content">
        <div
          v-show="selectedTab === 'gic'"
          class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">GIC Details</p>
        </div>
        <div v-show="selectedTab === 'checking'">
          <div
            class="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-800"
            v-for="(group, date) in groupedItemsByDate"
            :key="date"
          >
            <div class="flex justify-between items-center">
              <h3
                class="text-lg font-semibold text-gray-700 dark:text-gray-300"
              >
                {{ formatDate(date) }}
              </h3>
              <h3
                class="text-lg font-semibold text-gray-700 dark:text-gray-300"
              >
                ${{ group.totalAmount }}
              </h3>
            </div>

            <span
              v-for="item in group.items"
              :key="item._id"
              class="text-sm flex cursor-pointer items-center my-4 text-gray-500 dark:text-gray-400"
              @click="goToItemDetails(item._id)"
            >
              <div class="flex-shrink-0 mr-4">
                <img
                  class="rounded-full w-8 h-8"
                  :src="getRandomLogo()"
                  alt="image description"
                />
              </div>
              <span
                class="flex justify-between w-full"
                v-if="item.paidBy === user.id"
              >
                <p>{{ item.name }}</p>
                <p>${{ item.amount }}</p>
              </span>
              <span
                class="flex justify-between w-full"
                v-else-if="
                  item.splitBetween &&
                  item.splitBetween.length > 0 &&
                  item.splitBetween.some((split) => split.user === user.id)
                "
              >
                <p>{{ item.name }}</p>
                <p>
                  ${{
                    item.splitBetween.find((split) => split.user === user.id)
                      .amountOwed
                  }}
                </p>
              </span>
            </span>
          </div>
        </div>
        <div
          v-show="selectedTab === 'savings'"
          class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">Saving Details</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Navbar from "../components/Navbar.vue";
import setupAxiosInstance from "./../utils/api";

const api = setupAxiosInstance();

const backend_url = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const items = ref([]);
const selectedTab = ref("checking");
const router = useRouter();
const route = useRoute();

const logoDB = [
  "https://banner2.cleanpng.com/20180403/aww/avhnjhtse.webp",
  "https://seeklogo.com/images/B/Burger_King-logo-67A54F414B-seeklogo.com.png",
  "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
  "https://media.licdn.com/dms/image/v2/D4D12AQF1atLwrf0uCw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1712896962304?e=2147483647&v=beta&t=aq1bWMytjFQOK7caz-7FBO0trgF7Tol363NJMSoQpEU",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Gap_logo.svg/2048px-Gap_logo.svg.png",
];

const getRandomLogo = () => {
  const randomIndex = Math.floor(Math.random() * logoDB.length);
  return logoDB[randomIndex];
};

const calculateWidth = (value, total) => {
  return (value / total) * 100;
};

const formatDate = (inputDate) => {
  const date = new Date(inputDate);

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  const day = date.getDate();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || [11, 12, 13].includes(day % 100) ? 0 : day % 10
  ];

  return `${formattedDate.replace(day, day + suffix)}`;
};

const fetchItems = async () => {
  try {
    const response = await api.get(`${backend_url}/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    items.value = response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

const groupedItemsByDate = computed(() => {
  const grouped = {};
  items.value.forEach((item) => {
    const date = new Date(item.createdAt).toLocaleDateString();

    if (!grouped[date]) {
      grouped[date] = { items: [], totalAmount: 0 };
    }

    grouped[date].items.push(item);

    if (item.paidBy === user.id) {
      grouped[date].totalAmount += item.amount;
    } else if (
      item.splitBetween &&
      item.splitBetween.length > 0 &&
      item.splitBetween.some((split) => split.user === user.id)
    ) {
      grouped[date].totalAmount += item.splitBetween.find(
        (split) => split.user === user.id
      ).amountOwed;
    }
  });

  return grouped;
});

const totalAmount = computed(() => {
  return items.value.reduce((sum, item) => {
    if (item.paidBy === user.id) {
      return sum + item.amount;
    }

    if (
      item.splitBetween &&
      item.splitBetween.length > 0 &&
      item.splitBetween.some((split) => split.user === user.id)
    ) {
      const splitAmount = item.splitBetween.find(
        (split) => split.user === user.id
      ).amountOwed;
      return sum + splitAmount;
    }
    return sum;
  }, 0);
});

const daysRemainingInMonth = () => {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDayOfMonth.getDate() - today.getDate();
};

const goToItemDetails = (id) => {
  router.push(`/items/${id}`);
};

onMounted(fetchItems);
watch(route, () => {
  fetchItems();
  location.reload();
});
</script>
