"use client"

import { useState } from "react"

interface SavedPlace {
  id: string
  name: string
  address: string
  icon: string
}

interface TrustedContact {
  id: string
  name: string
  phone: string
}

const USER_PROFILE = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  rating: 4.9,
  totalRides: 127,
  memberSince: "Jan 2023",
}

const SAVED_PLACES: SavedPlace[] = [
  { id: "1", name: "Home", address: "123 Main St, Colorado Springs, CO", icon: "home" },
  { id: "2", name: "Work", address: "456 Business Ave, Colorado Springs, CO", icon: "work" },
]

const TRUSTED_CONTACTS: TrustedContact[] = [
  { id: "1", name: "Jane Doe", phone: "+1 (555) 987-6543" },
  { id: "2", name: "Mom", phone: "+1 (555) 456-7890" },
]

const LANGUAGES = ["English", "Spanish", "French", "German", "Chinese", "Arabic"]

interface AccountScreenProps {
  onLogout?: () => void
}

export function AccountScreen({ onLogout }: AccountScreenProps) {
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSavedPlaces, setShowSavedPlaces] = useState(false)
  const [showSafety, setShowSafety] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-600 px-4 pt-4 pb-8">
        <h1 className="text-xl font-bold text-white mb-4">Account</h1>
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-600">
              {USER_PROFILE.name[0]}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-lg">{USER_PROFILE.name}</h2>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{USER_PROFILE.rating}</span>
                <span className="mx-1">|</span>
                <span>{USER_PROFILE.totalRides} rides</span>
              </div>
            </div>
            <button 
              onClick={() => setShowEditProfile(true)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto -mt-4">
        <div className="bg-white rounded-t-3xl pt-4 min-h-full">
          <div className="px-4 space-y-2">
            {/* Saved Places */}
            <button
              onClick={() => setShowSavedPlaces(true)}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Saved Places</p>
                <p className="text-sm text-gray-500">Home, Work, and more</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Safety */}
            <button
              onClick={() => setShowSafety(true)}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Safety Center</p>
                <p className="text-sm text-gray-500">Emergency contacts, trip sharing</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-500">Language, notifications</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Help & Support */}
            <button
              onClick={() => setShowSupport(true)}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Help & Support</p>
                <p className="text-sm text-gray-500">FAQ, chat support</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Become a Driver */}
            <button className="w-full flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-emerald-700">Become a Driver</p>
                <p className="text-sm text-emerald-600">Earn money on your schedule</p>
              </div>
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Legal */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              <button className="w-full flex items-center gap-4 p-3">
                <p className="text-sm text-gray-500">Privacy Policy</p>
              </button>
              <button className="w-full flex items-center gap-4 p-3">
                <p className="text-sm text-gray-500">Terms of Service</p>
              </button>
            </div>

            {/* Sign Out */}
            <button 
              onClick={onLogout}
              className="w-full py-4 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign Out
            </button>

            {/* Version */}
            <p className="text-center text-xs text-gray-400 pb-4">
              GlideWay v1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Edit Profile</h2>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-600">
                    {USER_PROFILE.name[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={USER_PROFILE.name}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={USER_PROFILE.email}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue={USER_PROFILE.phone}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="w-full py-4 bg-emerald-500 text-white font-semibold rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Places Modal */}
      {showSavedPlaces && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Saved Places</h2>
              <button 
                onClick={() => setShowSavedPlaces(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              {SAVED_PLACES.map((place) => (
                <div key={place.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    {place.icon === "home" ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{place.name}</p>
                    <p className="text-sm text-gray-500 truncate">{place.address}</p>
                  </div>
                  <button className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-emerald-600 font-medium flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Place
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Modal */}
      {showSafety && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Safety Center</h2>
              <button 
                onClick={() => setShowSafety(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Trusted Contacts */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Trusted Contacts</h3>
                <div className="space-y-2">
                  {TRUSTED_CONTACTS.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold">
                        {contact.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      </div>
                      <button className="text-red-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-emerald-600 font-medium">
                    + Add Contact
                  </button>
                </div>
              </div>

              {/* Safety Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Safety Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="font-medium text-gray-900">Auto-share trips</span>
                    </div>
                    <button className="w-12 h-6 bg-emerald-500 rounded-full p-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-gray-900">Trip recording</span>
                    </div>
                    <button className="w-12 h-6 bg-gray-300 rounded-full p-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Language */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Language</h3>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`py-3 rounded-xl font-medium text-sm ${
                        selectedLanguage === lang
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-900">Push Notifications</span>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full p-1 ${notifications ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications ? "ml-auto" : ""}`} />
                </button>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-900">Dark Mode</span>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full p-1 ${darkMode ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? "ml-auto" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupport && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Help & Support</h2>
              <button 
                onClick={() => setShowSupport(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <button className="w-full flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-emerald-700">Live Chat</p>
                  <p className="text-sm text-emerald-600">Chat with support now</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">FAQ</p>
                  <p className="text-sm text-gray-500">Frequently asked questions</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-500">support@glideway.com</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
