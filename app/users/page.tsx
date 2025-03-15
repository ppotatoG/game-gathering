"use client"
import { useEffect, useState } from "react"

export default function UsersPage() {

  useEffect(() => {
    const fetchUsers = async () => {
      fetch('/riot/summoner?name=Chason&tag=KR1')
        .then(r => r.json())
        .then(data => console.log(data))
    }
    fetchUsers()
  }, [])

  return (
    <div></div>
  )
}
