import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Progress,
    Tooltip,
    Spinner,
    Modal,
} from "flowbite-react";
import { usedata } from "../../server/photo";
import Loader from "../../components/Loader";

import { useAuth } from "../../context/auth/AuthContext";
import { firestore } from "../../context/auth/connection/connection";
import { doc, updateDoc } from "firebase/firestore";
import {
    getAuth,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";

const ProfilePage = () => {
    const [details, setDetails] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        companyName: "",
        companyWebsiteLink: "",
        profileUrl: "",
    });
    const [loading, setLoading] = useState(false);
    const [profileimage, setProfileimage] = useState(null);
    const { currentUseruid } = useAuth();
    const [passwordChange, setPasswordChange] = useState({
        currentPassword: "",
        newPassword: "",
        showModal: false,
    });
    const auth = getAuth();

    const getUserDetails = async () => {
        setLoading(true);
        try {
            const userDetails = await usedata({ currentUseruid, firestore });
            if (userDetails) {
                setDetails(userDetails);
                setProfileimage(userDetails.profileUrl);
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getUserDetails();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!details.firstName || !details.lastName || !details.phoneNumber) {
            alert(
                "Please fill in all required fields (First Name, Last Name, and Phone Number)"
            );
            return;
        }

        try {
            const userDocRef = doc(firestore, "Users", currentUseruid);
            await updateDoc(userDocRef, {
                firstName: details.firstName,
                lastName: details.lastName,
                phoneNumber: details.phoneNumber,
                ...(details.companyName && { companyName: details.companyName }),
                ...(details.companyWebsiteLink && {
                    companyWebsiteLink: details.companyWebsiteLink,
                }),
            });
        } catch (error) {
            console.error("Error updating profile: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        setLoading(true);
        try {
            // First reauthenticate
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                passwordChange.currentPassword
            );
            await reauthenticateWithCredential(auth.currentUser, credential);

            // Then update password
            await updatePassword(auth.currentUser, passwordChange.newPassword);

            alert("Password updated successfully!");
            setPasswordChange({
                currentPassword: "",
                newPassword: "",
                showModal: false,
            });
        } catch (error) {
            console.error("Error updating password: ", error);
            if (error.code === "auth/wrong-password") {
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:space-x-6  min-h-screen">
            <div className="w-full md:w-3/4">
                <Card className="dark:bg-gray-800">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Personal info
                    </h2>
                    <div className="flex items-center mb-6">
                        {profileimage ? (
                            <img
                                src={profileimage}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-teal-500 dark:bg-teal-600 rounded-full flex items-center justify-center text-white">
                                <span className="text-2xl">
                                    {details.firstName
                                        ? details.firstName[0].toUpperCase() +
                                        details.lastName[0].toUpperCase()
                                        : "+"}
                                </span>
                            </div>
                        )}
                    </div>
                    <form className="space-y-4" onSubmit={handleSave}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    First Name*
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={details.firstName || ""}
                                    onChange={(e) =>
                                        setDetails({ ...details, firstName: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Last Name*
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={details.lastName || ""}
                                    onChange={(e) =>
                                        setDetails({ ...details, lastName: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={details.email || ""}
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                readOnly
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone Number*
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="tel"
                                        value={details.phoneNumber || ""}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        onChange={(e) =>
                                            setDetails({ ...details, phoneNumber: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={details.companyName || ""}
                                    onChange={(e) =>
                                        setDetails({ ...details, companyName: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Company Website Link
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={details.companyWebsiteLink || ""}
                                onChange={(e) =>
                                    setDetails({ ...details, companyWebsiteLink: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex space-x-4">
                            <Button
                                type="submit"
                                color="dark"
                                disabled={loading}
                                isProcessing={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                                color="dark"
                                disabled={loading}
                                onClick={() =>
                                    setPasswordChange({ ...passwordChange, showModal: true })
                                }
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
            {/* Right Section - Subscription Info */}
            <div className="w-full md:w-1/4 mt-6 md:mt-0">
                <Card className="dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Your Subscription
                    </h3>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {details.storage_used} of 5.00 GB used
                        </p>
                        <Progress
                            progress={(details.storage_used / 5) * 100}
                            color="yellow"
                            className="mb-4"
                        />
                        <div className="space-y-1 text-sm">
                            <p className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span className="text-gray-500">
                                    Available ({(5 - details.storage_used).toFixed(2)} GB)
                                </span>
                                <span></span>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Add Modal for Password Change */}
            <Modal
                show={passwordChange.showModal}
                onClose={() =>
                    setPasswordChange({ ...passwordChange, showModal: false })
                }
            >
                <Modal.Header>Change Password</Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Current Password
                            </label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={passwordChange.currentPassword}
                                onChange={(e) =>
                                    setPasswordChange({
                                        ...passwordChange,
                                        currentPassword: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={passwordChange.newPassword}
                                onChange={(e) =>
                                    setPasswordChange({
                                        ...passwordChange,
                                        newPassword: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-end w-full gap-4">
                    <Button
                        color="gray"
                        onClick={() =>setPasswordChange({ ...passwordChange, showModal: false })}
                    >
                        Cancel
                        </Button>
                        <Button
                            color="dark"
                            onClick={handlePasswordChange}
                            disabled={
                            loading ||
                            !passwordChange.currentPassword ||
                            !passwordChange.newPassword
                        }
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProfilePage;
