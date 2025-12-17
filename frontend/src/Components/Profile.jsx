import { useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { Loader } from "lucide-react";
import { isDragging } from "framer-motion";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);


  // we will integrate interview result in it later

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleRefresh = () => {
    setTimeout(()=>{
      setData(true);
    }, 5000);
  }

  return (
    <div className="pt-20 flex justify-center gap-10">
      
      <div className="max-w-2xl  p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.name}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <div className="bg-white rounded-full border-1 border-teal-600">
                  <span className="text-teal-500 px-5">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-base-300 w-250 mt-8 rounded-xl h-180 ">
            <div className="w-full flex justify-center gap-10 px-10 h-50 mt-7 mx-0 ">
              <div className=" w-1/2 bg-base-200 rounded-lg">
                  <div>

                  </div>
                  <p className="text-gray-400 text-center">growth</p>
              </div>

              <div className=" w-1/2 bg-base-200 rounded-lg">
                  <div>
                    
                  </div>
                  <p className="text-gray-400 text-center">Top</p>
              </div>

            </div>

            <div className="w-full flex justify-center gap-10 px-10 h-50 mt-9 mx-0">
              <div className=" w-1/4 bg-base-200 rounded-lg">
                  <div>

                  </div>
                  <p className="text-gray-400 text-center">Rank</p>
              </div>

              <div className=" w-3/4 bg-base-200 rounded-lg">
                  <p className="text-gray-400 text-center">Inbox</p>
                  <div className="flex justify-center items-center">
                    
                  </div>
              </div>

            </div>

            <div className="w-full flex justify-center gap-10 px-10 h-50 mt-9 mx-0">
              <div className=" w-full bg-base-200 rounded-lg">
                  <div>

                  </div>
                  <p className="text-gray-400 text-center">Streak</p>
              </div>

              

            </div>  

            
      </div>

    </div>
  );
};
export default Profile;