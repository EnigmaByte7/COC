"use server"
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function getPlayerStats(userId) {
console.log('userid..', userId);
  if (!userId) return { total: 0, wins: 0, losses: 0, draws: 0 };

  try {
    const db = client.db("test");

    const results = await db.collection("matches").aggregate([
      { 
        $match: { 
          players: userId, 
          status: "FINISHED" 
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          wins: { $sum: { $cond: [{ $eq: ["$winner", userId] }, 1, 0] } },
          draws: { $sum: { $cond: [{ $eq: ["$status", "DRAW"] }, 1, 0] } },
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          wins: 1,
          draws: 1,
          losses: { $subtract: ["$total", { $add: ["$wins", "$draws"] }] }
        }
      }
    ]).toArray();

    return results[0] || { total: 0, wins: 0, losses: 0, draws: 0 };
  } catch (e) {
    console.error(e);
    return { total: 0, wins: 0, losses: 0, draws: 0 };
  }
}