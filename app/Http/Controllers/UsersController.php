<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    /**
     * Fetch all users (including archived if requested)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsers(Request $request)
    {
        $query = User::with('role'); // Load the role relationship

        // Filter archived users
        if ($request->has('archived') && $request->archived === 'true') {
            $query->onlyTrashed(); // Fetch only soft-deleted users
        }

        $users = $query->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ], 200);
    }

    /**
     * Archive a user (soft delete)
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function archiveUser($id)
    {
        $user = User::findOrFail($id);

        // Check if already archived
        if ($user->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'User is already archived!',
            ], 400);
        }

        $user->delete(); // Soft delete the user

        return response()->json([
            'success' => true,
            'message' => 'User archived successfully!',
        ], 200);
    }

    /**
     * Restore an archived user
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function restoreUser($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        // Check if not archived
        if (!$user->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'User is not archived!',
            ], 400);
        }

        $user->restore(); // Restore the soft-deleted user

        return response()->json([
            'success' => true,
            'message' => 'User restored successfully!',
        ], 200);
    }
    public function getArchivedUsers()
    {
        $archivedUsers = User::onlyTrashed()->with('role')->get();

        return response()->json([
            'success' => true,
            'data' => $archivedUsers,
        ], 200);
    }
}