import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Patron {
  name: string;
  imageUrl: string;
  spanClassName?: string;
}

const BASE_URL = "https://assets.jmrecondo.com/react-assessment/"

const PATRONS: Patron[] = [
  {
    name: "Jung Eunbi",
    imageUrl: `${BASE_URL}jung_eunbi.webp`,
    spanClassName: "sm:col-span-2 lg:row-span-2",
  },
  {
    name: "Kang Jiyoung",
    imageUrl: `${BASE_URL}kang_jiyoung.webp`,
  },
  {
    name: "Choi Yuna",
    imageUrl: `${BASE_URL}choi_yuna.webp`,
  },
  {
    name: "Kim Yewon",
    imageUrl: `${BASE_URL}kim_yewon.webp`,
  },
  {
    name: "Goo Hara",
    imageUrl: `${BASE_URL}goo_hara.webp`,
  },
  {
    name: "Park Sunyoung",
    imageUrl: `${BASE_URL}park_sunyoung.webp`,
  },
  {
    name: "Park Jiyeon",
    imageUrl: `${BASE_URL}park_jiyeon.webp`,
  },
  {
    name: "Heo Youngji",
    imageUrl: `${BASE_URL}heo_youngji.webp`,
  },
  {
    name: "Hong Eunchae",
    imageUrl: `${BASE_URL}hong_eunchae.webp`
  }
];

export default function PatronsPage() {
  return (
    <div>
      <div className="mb-7 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">
          Patrons{" "}
          <span className="text-lg font-normal italic text-muted-foreground">
            (I hope)
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-40 sm:auto-rows-45 gap-4">
        {PATRONS.map((patron, index) => (
          <Card
            key={index}
            className={cn("relative overflow-hidden hover:scale-105 transition-all duration-300", patron.spanClassName)}
          >
            <img
                referrerPolicy="no-referrer"
              src={patron.imageUrl}
              alt={patron.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <CardHeader className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent pt-12">
              <CardTitle className="text-base text-white">
                {patron.name}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
