'use client'; 

import React, { useEffect } from 'react'

import Modal from '@/components/ui/modal';
import useStoreModal from '@/hooks/use-store-modal';

const HomeClient = () => {
    const onOpen = useStoreModal((state) => state.onOpen); 
    const isOpen = useStoreModal((state) => state.isOpen); 

    useEffect(() => {
        if(!isOpen) {
            onOpen(); 
        }
    }, [isOpen, onOpen])
  return (
    <>
    
        hello
    

    </>
  )
}

export default HomeClient