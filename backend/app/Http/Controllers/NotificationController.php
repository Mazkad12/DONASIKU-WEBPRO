<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user() ?? auth()->guard('sanctum')->user();
        
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Return latest 3 notifications as requested, or more if needed by the UI
        // Let's return the latest 10, but the UI will slice it to 3.
        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'unread_count' => Notification::where('user_id', $user->id)->where('is_read', false)->count()
        ]);
    }

    public function markAsRead($id)
    {
        $user = Auth::user() ?? auth()->guard('sanctum')->user();
        
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $notification = Notification::where('user_id', $user->id)->findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        $user = Auth::user() ?? auth()->guard('sanctum')->user();
        
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        Notification::where('user_id', $user->id)->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }
}
