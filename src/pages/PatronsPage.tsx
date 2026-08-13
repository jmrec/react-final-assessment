import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Patron {
  name: string;
  imageUrl: string;
  spanClassName?: string;
}

const PATRONS: Patron[] = [
  {
    name: "Jung Eunbi",
    imageUrl: "https://pbs.twimg.com/media/DHNeH_BXUAAAsOt?format=jpg&name=large",
    spanClassName: "sm:col-span-2 lg:row-span-2",
  },
  {
    name: "Kang Jiyoung",
    imageUrl: "https://alchetron.com/cdn/kang-ji-yong-d82753e9-24ec-42ce-9e0a-aa684236b8a-resize-750.png",
  },
  {
    name: "Choi Yuna",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwqA19eij4lKR1sgvYcv2vwL8iWqd8MgVp3NuJgKqbfA&s",
  },
  {
    name: "Kim Yewon",
    imageUrl: "https://kprofiles.com/wp-content/uploads/2016/06/UMJI-1-900x600.jpg",
  },
  {
    name: "Goo Hara",
    imageUrl: "https://gbaike-image.cdn.bcebos.com/8b82b9014a90f603738d8102fd48a41bb051f8194779/8b82b9014a90f603738d8102fd48a41bb051f8194779_url?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXJtYXJrL3dhdGVybWFyaw,t_60,g_7,xp_5,yp_2,P_20",
  },
  {
    name: "Lee Hyomin",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmjSvOU-ntj6uJuEKapguEyo-6b8Z_PJ_dCOHO2RwJ9w&s",
  },
  {
    name: "Park Jiyeon",
    imageUrl: "https://legacy.kpopping.com/ee/4/250420-T-ara-Jiyeon-Weibo-update-documents-1.jpeg",
  },
  {
    name: "Heo Youngji",
    imageUrl: "https://araisyahfitria.wordpress.com/wp-content/uploads/2014/12/osen-interview-1.jpg",
  },
  {
    name: "Hong Eunchae",
    imageUrl: "https://preview.redd.it/250915-hong-eunchae-instagram-update-v0-r2vxiszbk8pf1.jpg?width=640&crop=smart&auto=webp&s=856e0b553bae9de85cad1ef133c1959a95c7ef06"
  }
];

export default function PatronsPage() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold">Patrons</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-40 sm:auto-rows-45 gap-4">
        {PATRONS.map((patron, index) => (
          <Card
            key={index}
            className={cn("relative overflow-hidden", patron.spanClassName)}
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
