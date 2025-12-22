<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        // Send Notification to Receiver
        $receiver = User::find($request->receiver_id);
        if ($receiver) {
            // Determine the link based on receiver's role
            $baseUrl = ($receiver->role === 'donatur') ? '/donatur/chat' : '/penerima/chat';
            $link = $baseUrl . '?peer_id=' . $request->user()->id;

            Notification::create([
                'user_id' => $receiver->id,
                'title' => 'Pesan dari ' . $request->user()->name,
                'message' => 'Mengirim pesan: "' . substr($request->message, 0, 50) . (strlen($request->message) > 50 ? '...' : '') . '"',
                'type' => 'chat_message',
                'link' => $link
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $message,
        ], 201);
    }

    public function getConversations(Request $request)
    {
        $userId = $request->user()->id;

        // Get all unique users interacted with
        $sent = Message::where('sender_id', $userId)->select('receiver_id as peer_id');
        $received = Message::where('receiver_id', $userId)->select('sender_id as peer_id');

        $peerIds = $sent->union($received)->pluck('peer_id');
        $peers = User::whereIn('id', $peerIds)->get();

        $conversations = $peers->map(function ($peer) use ($userId) {
            $lastMessage = Message::where(function ($q) use ($userId, $peer) {
                $q->where('sender_id', $userId)->where('receiver_id', $peer->id);
            })
                ->orWhere(function ($q) use ($userId, $peer) {
                    $q->where('sender_id', $peer->id)->where('receiver_id', $userId);
                })
                ->latest()
                ->first();

            return [
                'peer' => $peer,
                'last_message' => $lastMessage,
            ];
        })->sortByDesc('last_message.created_at')->values();

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    public function getMessages(Request $request, $peerId)
    {
        $userId = $request->user()->id;

        $messages = Message::where(function ($q) use ($userId, $peerId) {
            $q->where('sender_id', $userId)->where('receiver_id', $peerId);
        })
            ->orWhere(function ($q) use ($userId, $peerId) {
                $q->where('sender_id', $peerId)->where('receiver_id', $userId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function deleteMessage(Request $request, $id)
    {
        $message = Message::findOrFail($id);

        // Ensure user is the sender
        if ($message->sender_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dihapus'
        ]);
    }
}
