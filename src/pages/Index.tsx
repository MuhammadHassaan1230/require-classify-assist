
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BatchClassify from '@/components/BatchClassify';
import ClassifyRequirement from '@/components/ClassifyRequirement';
import ClassifyAndSearch from '@/components/ClassifyAndSearch';
import SearchRequirements from '@/components/SearchRequirements';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-gray-800">Requirements Analysis Tool</h1>
          <p className="text-gray-600 mt-2">Classify and analyze software requirements with machine learning</p>
        </header>

        <Tabs defaultValue="classify-single" className="w-full">
          <TabsList className="w-full justify-center mb-6 bg-white p-1 shadow">
            <TabsTrigger value="classify-single" className="flex-1">
              Classify Requirement
            </TabsTrigger>
            <TabsTrigger value="batch-classify" className="flex-1">
              Batch Classify
            </TabsTrigger>
            <TabsTrigger value="classify-search" className="flex-1">
              Classify & Search
            </TabsTrigger>
            <TabsTrigger value="search" className="flex-1">
              Search Requirements
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="classify-single">
            <ClassifyRequirement />
          </TabsContent>
          
          <TabsContent value="batch-classify">
            <BatchClassify />
          </TabsContent>
          
          <TabsContent value="classify-search">
            <ClassifyAndSearch />
          </TabsContent>
          
          <TabsContent value="search">
            <SearchRequirements />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
