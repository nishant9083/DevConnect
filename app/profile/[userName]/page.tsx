import { Metadata } from "next";
import { ProfileForm } from "@/components/profile-form";
import { ProfileView } from "@/components/profile-view";

export const metadata: Metadata = {
  title: "Profile - DevConnect",
  description: "Complete your DevConnect profile",
};

export default async function ProfilePage({ params }: { params: any }) {
  const { userName } = await params;
  return (
    <div className="p-8  ">
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Complete your profile to connect with other developers
        </p>
      </div> */}
      {/* <ProfileForm /> */}
      <div className="">
        <ProfileView userName={userName} />
      </div>
    </div>
  );
}
