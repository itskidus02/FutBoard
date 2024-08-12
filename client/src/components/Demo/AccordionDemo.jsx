import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionDemo() {
  return (
    <div className="flex  font-poppins flex-col items-center">
      <Accordion type="single" collapsible className="w-5/6 mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger>How do I create a new table?</AccordionTrigger>
          <AccordionContent>
            To create a new table, navigate to the "create table" button from
            home page or profile page. Fill in the required information such as
            table name, number of teams, team names, club logos, and any other
            relevant details, then save the changes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            How can I update or edit a team's information?
          </AccordionTrigger>
          <AccordionContent>
            To update a table and team's information, go to the "profile"
            section, find the table you wish to edit, and click on the "Update
            table" button. Make the necessary changes and save the updated
            information.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What should I do if I need to delete a table?
          </AccordionTrigger>
          <AccordionContent>
            To delete a table, go to the "profile" section, locate the team you
            want to remove, and click on the "Delete table" button. Confirm the
            deletion when prompted. Please note that deleting a table will also
            remove any associated data.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            How do I create a new match between clubs?
          </AccordionTrigger>
          <AccordionContent>
            To create a new match, go to the "profile" section and choose the
            desired table and click "manage Matches". Once there use the
            dropdown menus to select the clubs participating in the match. Enter
            the match details such as date and time, and goals scored in that
            match. then save the match.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            Can I update or delete a match once it is created?
          </AccordionTrigger>
          <AccordionContent>No you cant</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            How can I manage tables and standings for the teams?
          </AccordionTrigger>
          <AccordionContent>
            All you have to do is create table and teams under that table. and
            after that create matches between those teams and FutBoard will do
            the rest for you
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
