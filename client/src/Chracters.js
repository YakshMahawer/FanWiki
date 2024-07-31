import React, { useEffect, useState } from 'react';
import './chracters.css';

const Chracters = () => {
    const actors = [
        {
            "actor_name": "Ryan Reynolds",
            "character_name": "Deadpool / Wade Wilson",
            "photo": "https://vz.cnwimg.com/wp-content/uploads/2019/04/rr.jpg",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Ryan_Reynolds"
          },
          {
            "actor_name": "Hugh Jackman",
            "character_name": "Wolverine / Logan",
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmh7jbBf5r0Oj2SCdKyJSVyQQYjJkcrBpHWQ&s",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Hugh_Jackman"
          },
          {
            "actor_name": "Morena Baccarin",
            "character_name": "Vanessa",
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJPpJ8NhNiStg5n4oc9IjtA-8kLRhlgKOdMQ&s",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Morena_Baccarin"
          },
          {
            "actor_name": "Dafne Keen",
            "character_name": "X - 23",
            "photo": "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1183564872.jpg?crop=0.607xw:1.00xh;0.255xw,0&resize=640:*",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Dafne_Keen"
          },
          {
            "actor_name": "Josh Brolin",
            "character_name": "Cable",
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF5xJyY7oQWfUOhzAjpK0f_bRYZRNu4HBd2g&s",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Josh_Brolin"
          },
          {
            "actor_name": "Emma Corrin",
            "character_name": "Casandara Nova",
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpd0qmBMbdS6lWS7D0I19WS2MUK0G2X3-XBg&s",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Emma_Corrin"
          },
          {
            "actor_name": "Zazie Beetz",
            "character_name": "Domino",
            "photo": "https://ntvb.tmsimg.com/assets/assets/981946_v9_bc.jpg",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Zazie_Beetz"
          },
          {
            "actor_name": "Karan Soni",
            "character_name": "Dopinder",
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxVoFBMcn8KYOAQcMrstN7-HyiQvRPu6Kzg&s",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Karan_Soni"
          },
          {
            "actor_name": "Ed Skrein",
            "character_name": "Ajax",
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-TPcIFso6oFHt9T2i3_Aglmi4f3pnivcvHQ&s",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Ed_Skrein"
          },
          {
            "actor_name": "T.J. Miller",
            "character_name": "Weasel",
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqFjvyDDJX1vcDa1COqNyPfEj5bbav1FW40A&s",
            "wikipedia_link": "https://en.wikipedia.org/wiki/T.J._Miller"
          },
          {
            "actor_name": "Gina Carano",
            "character_name": "Angel Dust",
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzRbxjsAAGgXiKD_eP_VSH40FucJ3VlnKNJQ&s",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Gina_Carano"
          },
          {
            "actor_name": "Brianna Hildebrand",
            "character_name": "Negasonic Teenage Warhead",
            "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK4plOfFOT5UtHdlAHiq5lkXGkwv0pazs1XA&s",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Brianna_Hildebrand"
          },
          {
            "actor_name": "Stefan Kapičić",
            "character_name": "Colossus (voice)",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Stefan_Kapicic_by_Gage_Skidmore.jpg/1200px-Stefan_Kapicic_by_Gage_Skidmore.jpg",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Stefan_Kapi%C4%8Di%C4%87"
          },
          {
            "actor_name": "Leslie Uggams",
            "character_name": "Blind Al",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Leslie_Uggams_1997a.jpg",
            "wikipedia_link": "https://en.wikipedia.org/wiki/Leslie_Uggams"
          }
    ]

    return (
        <div className="actors-list">
        {actors.map((actor, index) => (
            <div key={index} className="actor-card">
            <img src={actor.photo} alt={actor.actor_name} className="actor-photo" />
            <h3>{actor.actor_name}</h3>
            <p>as {actor.character_name}</p>
            </div>
        ))}
        </div>
    );
}

export default Chracters;