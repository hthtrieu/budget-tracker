import chroma from "chroma-js";
import { clsx, type ClassValue } from "clsx";
// import { jwtDecode, JwtPayload } from "jwt-decode";
import { twMerge } from "tailwind-merge";
// import { format, isDate } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const isFunction = (func: any) => {
  return func && typeof func === "function";
};

export const convertDate = (date: string) => {
  return date ? date?.split("-").reverse()?.join("/") : "";
};

export function objectToFormData(
  obj: any,
  formData: FormData | null = null,
  namespace = ""
): FormData {
  const fd = formData || new FormData();

  for (const property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      const formKey = namespace ? `${namespace}.${property}` : property;

      if (obj[property] instanceof Date) {
        fd.append(formKey, obj[property].toISOString());
      } else if (Array.isArray(obj[property])) {
        obj[property].forEach((item: any, index: number) => {
          const itemNamespace = `${formKey}[${index}]`;
          objectToFormData(item, fd, itemNamespace);
        });
      } else if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof File)
      ) {
        objectToFormData(obj[property], fd, formKey);
      } else {
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
}

export const replacePathWithId = (path: string, id: string) => {
  return path.replace(":id", id);
};

export const speak = (text: string) => {
  const text_to_speech = new SpeechSynthesisUtterance();
  text_to_speech.text = text;
  text_to_speech.lang = "en-US";
  window.speechSynthesis.speak(text_to_speech);
};

export const convertDateToString = (text: string) => {
  const date = new Date(text);
  return date.toDateString();
};

export const shuffleArray = (array: any[]) => {
  const newArray = [...array]; // Create a shallow copy of the original array
  return newArray.sort(() => Math.random() - 1); // Corrected sorting logic
};

export const getRandomColor = (seed?: string): string => {
  if (seed) {
    // Tạo màu dựa trên giá trị đầu vào để đảm bảo tính nhất quán
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 80%)`;
    return color;
  } else {
    // Màu hoàn toàn ngẫu nhiên
    const randomHue = Math.floor(Math.random() * 360);
    return `hsl(${randomHue}, 70%, 80%)`;
  }
};

// export const formatToLocalDate = (date: Date) => {
//   if (isDate(date)) {
//     return format(date, "yyyy-MM-dd");
//   }
//   return null;
// };
export const formatNumberToVND = (num: any) => {
  if (typeof num == "number") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  }
  return null;
};

interface ChartProps {
  dataKey: string;
  keyName: string;
  category: { name: string };
}

export const generateChartData = (data: ChartProps[]) => {
  return data.map((item: ChartProps) => ({
    dataKey: item.dataKey,
    keyName: item.keyName,
    fill: `var(--color-${item.keyName})`, // Áp dụng biến màu từ CSS
  }));
};

export const generateChartConfig = (data: ChartProps[]) => {
  // Lấy danh mục duy nhất
  const uniqueCategories = Array.from(
    new Map(data.map((item) => [item.keyName, item.category])).values()
  );

  // Tạo bảng màu gradient theo số lượng danh mục
  const colorScale = chroma
    .scale(["#d4edda", "#28a745", "#155724"]) // Các màu xanh lá cây
    .mode("oklch")
    .colors(uniqueCategories.length);

  // Ánh xạ từng danh mục với màu sắc và nhãn
  return uniqueCategories.reduce((config, category, index) => {
    config[category.name] = {
      label: category.name.charAt(0).toUpperCase() + category.name.slice(1), // Định dạng chữ hoa đầu
      color: colorScale[index], // Áp dụng màu sắc từ bảng màu
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);
};
